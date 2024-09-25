import install, { Vue } from './install';
import ModuleCollection from './module/module-collection';
import { forEachVaue } from './util';
function getState(store, path) {
  return path.reduce((start, current) => {
    return start[current]
  }, store.state)
}
function installModule(store, rootState, path, rootModule) {


  if (path.length > 0) {
    //根模块，只有是子模块的时候才需要将子模块的状态定义在根上面
    // rootState[path[path.length - 1]] = rootModule.state
    let parent = path.slice(0, -1).reduce((start, current) => {
      return start[current]
    }, rootState)
    store._withCommiting(() => {
      Vue.set(parent, path[path.length - 1], rootModule.state)
    })
    //parent[path[path.length - 1]] = rootModule.state
  }
  //我们需要获取命名空间前缀
  let namespaced = store._modules.getNamespace(path)
  console.log(namespaced)
  rootModule.forEachMutation((mutationKey, mutationValue) => {
    store._mutations[namespaced + mutationKey] = (store._mutations[namespaced + mutationKey] || [])
    store._mutations[namespaced + mutationKey].push((payload) => {
      store._withCommiting(() => {
        mutationValue(getState(store, path), payload) //更改状态的话肯定是在commiting=true的情况下
      })

      store.subscribes.forEach(fn => fn({ type: namespaced + mutationKey, payload }, store.state))

    })
  })
  rootModule.forEachAction((actionKey, actionValue) => {
    store._actions[namespaced + actionKey] = (store._actions[namespaced + actionKey] || [])
    store._actions[namespaced + actionKey].push((payload) => {
      let result = actionValue(store, payload)
      store.subscribes.forEach(fn => fn({ type: namespaced + actionKey, payload }, store.state))
      return result
    })

  })
  rootModule.forEachGetter((getterKey, getterValue) => {
    if (store._wrappedGetters[namespaced + getterKey]) {
      return console.warn('duplicate key')
    }
    store._wrappedGetters[namespaced + getterKey] = () => {
      return getterValue(getState(store, path))
    }
  })
  rootModule.forEachModule((moduleKey, module) => {
    installModule(store, rootState, path.concat(moduleKey), module)
  })
  console.log(store)
}

function resetStoreVm(store, state) {
  let oldVm = store._vm
  store.getters = {};
  const computed = {};
  const wrappedGetters = store._wrappedGetters;
  forEachVaue(wrappedGetters, (getterKey, getterValue) => {
    computed[getterKey] = getterValue;//将刚才包裹的计算属性直接赋予给计算属性
    Object.defineProperty(store.getters, getterKey, {
      get: () => {
        return store._vm[getterKey]
      }
    })
  })
  console.log('打印')
  console.log(state)
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed
  })
  if (store.strict) {
    //sync为true，数据变化后立刻执行此watch
    store._vm.$watch(() => store._vm._data.$$state, () => {//浪费性能,在开发环境中可以开启
      console.log(store._commiting, 'outside mutation')
    }, { sync: true, deep: true })
  }
  if (oldVm) {
    Vue.nextTick(() => oldVm.$destroy())
  }
}

class Store {
  constructor(options) {
    //将选项进行一个格式化操作
    this._modules = new ModuleCollection(options)
    this.strict = options.strict;//是否是严格模式
    //在Mutation中更改我做一个变量，如果变量为true,则表示在mutation中更改的
    this._commiting = false;
    console.log('格式化')
    console.log(this._modules)
    this._mutations = Object.create(null)
    this._actions = Object.create(null)
    this._wrappedGetters = Object.create(null)
    //传入根状态，将所有的子状态都定义在这个跟状态上
    const state = this._modules.root.state;
    this.plugins = options.plugins || []
    this.subscribes = []
    installModule(this, state, [], this._modules.root)
    resetStoreVm(this, state) //创建实例 将计算属性和state声明到我们的实例上

    this.plugins.forEach(plugin => plugin(this))

  }
  _withCommiting(fn) {
    this._commiting = true;
    fn()
    this._commiting = false
  }
  get state() {
    return this._vm._data.$$state
  }

  commit = (type, payload) => {
    if (this._mutations[type]) {
      this._mutations[type].forEach(fn => fn.call(this, payload))
    }

  }

  dispatch = (type, payload) => {
    if (this._actions[type]) {
      return Promise.all(this._actions[type].map(fn => fn.call(this, payload)))
    }
  }

  registerModule(path, module) {
    this._modules.register(path, module)
    //需要获取到包装后的结果
    installModule(this, this.state, path, module.newModule)
    resetStoreVm(this, this.state) //重置当前实例
  }

  subscribe(fn) {
    this.subscribes.push(fn)
  }


  replaceState(state) {

    this._withCommiting(() => {
      this._vm._data.$$state = state
    })
  }

}


export default {
  Store,
  install
}


//没命名空间
//1.状态 子模块的状态会被定义在根模块上
//2.计算属性 子模块的计算属性会被直接添加到根模块上
//3.mutation会收集同名的mutation
//4.action 会收集同名的action

//有命名空间
//1.状态 子模块的状态会被定义在根模块上
//2.计算属性要通过命名空间来访问
//3.mutation action也要通过空间来访问
