import Vue from 'vue'
import Vuex from '@/vuex'
// import logger from 'vuex/dist/logger'

Vue.use(Vuex)

// const logger = function (store) {
//   let prevState = JSON.parse(JSON.stringify(store.state))
//   store.subscribe(function (mutationType, rootState) {
//     // console.log(mutationType, rootState)
//     let nextState = JSON.parse(JSON.stringify(rootState))
//     console.log(mutationType, prevState)
//     console.log(mutationType, nextState)

//     prevState = nextState
//   })
// }

// const persists = function (store) {
//   let state = localStorage.getItem('VUEX')
//   if (state) {
//     store.replaceState(JSON.parse(state))
//   }
//   store.subscribe(function (mutationType, rootState) {

//     console.log('打印')
//     console.log(store.state)
//     localStorage.setItem('VUEX', JSON.stringify(store.state))
//   })
// }

const store = new Vuex.Store({
  strict: true,
  plugins: [
    // persitsPlugin,
    //logger
    // persists
  ],
  state: {
    age: 10,
    count: 'count33',
    a: {
      age: 2222
    }
  },
  getters: {
    myAge(state) {
      return state.age + 20
    }
  },
  mutations: {
    add(state, payload) {
      state.age += payload
    }
  },
  actions: {
    add({ commit }, payload) {
      setTimeout(() => {
        commit('add', payload)
      }, 200)
    }
  },
  modules: {
    a: {
      namespaced: true,
      state: {
        age: 10,
        aage: 20,
      },
      getters: {
        aAge(state) {
          return state.age + 20
        },
        myAge(state) {
          return state.age + 20
        }
      },
      mutations: {
        add(state, payload) {
          state.age += payload
        }
      },
      modules: {
        d: {
          namespaced: true,
          state: {
            age: 10,
            dage: 40,
          },
          getters: {
            ddAge(state) {
              return state.age + 20
            }
          },
          mutations: {
            add(state, payload) {
              state.age += payload
            }
          },
        },
      }
    },
    c: {
      namespaced: true,
      state: {
        age: 10,
        cage: 30
      },
      getters: {
        cAgec(state) {
          return state.age + 20
        }
      },
      mutations: {
        add(state, payload) {
          state.age += payload
        }
      }
    },
    e: {
      namespaced: true,
      state: {
        age: 10,
        cage: 30
      },
      getters: {
        cAgec(state) {
          return state.age + 20
        }
      },
      mutations: {
        add(state, payload) {
          state.age += payload
        }
      }
    }
  }
})

store.registerModule(['a', 'f'], {
  namespaced: true,
  state: {
    age: 60
  },
  getters: {
    cAgec(state) {
      return state.age + 20
    }
  },
  mutations: {
    add(state, payload) {
      state.age += '!'
    }
  }
})


export default store
