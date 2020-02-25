import Layout from '@/layout'
const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = routes
  }
}

const actions = {
  generateRouter ({commit}, menus) {
    return new Promise(resolve => {
      let accessedRoutes = convertRouter(menus)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

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
      if (item.children) {
        item.children.forEach(child => {
          let childNode = assembleRouter(child, false)
          children.push(childNode)
        })
      }

      parent.children = children
      accessedRouters.push(parent)
    })
  }
  return accessedRouters
}

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

export const componentsMap = {
  Admins: () => import('@/views/app/sys/admins') // 后台管理员
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
