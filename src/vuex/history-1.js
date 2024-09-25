export let Vue;
class Store {
  constructor(options) {
    let state = options.state;
    let getters = options.getters;
    let mutations = options.mutations;
    let actions = options.actions;
    this.mutations = mutations;
    this.actions = actions



    this.getters = {}
    const computed = {}
    Object.keys(getters).forEach(getterKey => {
      //将用户的方法借助计算属性来实现缓存
      computed[getterKey] = () => {
        //这里是有缓存的，如果依赖的值没有发生变化，那么这个函数不会重新执行
        return getters[getterKey](this.state)
      }
      //这里definePropert目的是代理，将我们属性代理到store上
      Object.defineProperty(this.getters, getterKey, {
        get: () => {
          //这里每次取值都会重新执行
          return this._vm[getterKey]
        }
      })
    })

    this._vm = new Vue({
      data: {//在定义数据的时候，vue会对带$或者_的做退让，不进行代理
        $$state: state
      },
      computed
    })
  }
  get state() {
    return this._vm._data.$$state
  }
  commit = (type, payload) => {
    console.log(this)
    this.mutations[type](this.state, payload)
  }
  dispatch = (type, payload) => {
    this.actions[type](this, payload)
  }
}

const install = _Vue => {
  Vue = _Vue;
  Vue.mixin({
    beforeCreate() {//让所有的组件都定义一个$store 属性可以用来获取store实例
      const options = this.$options;
      if (options.store) {
        this.$store = options.store;
      } else if (this.$parent && this.$parent.$store) {
        this.$store = this.$parent.$store
      }
    },
  })
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
