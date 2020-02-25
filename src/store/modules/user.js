import { doLogin, doGetBaseInfo } from '@/api/user'
import {getToken, setToken} from '../../utils/cookies'
const state = {
  token: getToken(),
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // 注册actions，类似vue里面的methods
  // 通过这个修改state里面的值
  // 可以直接用mutations修改，但是官方建议使用actions去调用mutations去修改
  login (context, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      doLogin({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        context.commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  getBaseInfo ({commit, state}) {
    return new Promise((resolve, reject) => {
      doGetBaseInfo(state.token).then(response => {
        const { data } = response
        const roles = ['admin']
        commit('SET_ROLES', roles)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
