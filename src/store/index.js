import Vue from 'vue'
import Vuex from 'vuex'
import {doLogin} from '../api/user'

Vue.use(Vuex)

// export default new Vuex.Store({
//   modules: {
//     cart,
//     products
//   },
//   strict: debug,
//   plugins: debug ? [createLogger()] : []
// })

const store = new Vuex.Store({
  state: {
    token: 'this is token',
    name: '',
    avatar: '',
    roles: []
  },
  getters: {
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    }
  },
  actions: {
    // 注册actions，类似vue里面的methods
    // 通过这个修改state里面的值
    // 可以直接用mutations修改，但是官方建议使用actions去调用mutations去修改
    login (context, userInfo) {
      const { username, password } = userInfo
      return new Promise((resolve, reject) => {
        doLogin({ username: username.trim(), password: password }).then(response => {
          const { data } = response
          context.commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
})

export default store
