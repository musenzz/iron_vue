import Vue from 'vue'
import Vuex from 'vuex'
import {doLogin, doGetBaseInfo} from '../api/user'
import {setToken} from '../utils/cookies'
import Layout from '@/layout'
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
    roles: [],
    routes:[]
  },
  getters: {
    token: state => state.token,
    roles: state => state.roles,
    routes:state => state.routes
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ROUTES: (state, routes) => {
      state.routes = routes
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
    },
    generateRouter ({commit}, menus) {
      return new Promise(resolve => {
        const accessedRoutes = convertRouter(menus)
        console.log(accessedRoutes)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    }
  }
})

function convertRouter (menus) {
  let accessedRouters = []
  if (menus) {
    menus.forEach(item => {
      let isParent = false
      if (item.children) {
        isParent = true
      }
      let parent = assembleRouter(item, isParent)

      let children = []
      if (item.children){
        item.children.forEach(child=>{
          let subChiledren = []//子菜单

        })
      }
      accessedRouters.push(parent)
    })
  }

  return accessedRouters
}

export const componentsMap = {}

function assembleRouter (item, isParent) {
  let component = Layout
  if (isParent !== true) {
    component = componentsMap[item.component]
  }
  let router = {
    path: item.path,
    name: item.name,
    meta: item.meta,
    hidden: item.hidden,
    component: component
  }

  return router
}

export default store
