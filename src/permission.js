// 在路由发生变化时进行一些特殊处理而定义的函数。跳转之前执行
import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'
import {getToken} from './utils/cookies'

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach( async (to, from, next) => {
  NProgress.start()
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      next({path: '/'})
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          const {menus} = await store.dispatch('getBaseInfo')
          const accessRoutes = await store.dispatch('generateRouter', menus)
          router.addRoutes(accessRoutes)
          next({ ...to, replace: true })
        } catch (e) {
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // next(`/login`)
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

// 跳转之后执行
router.afterEach(() => {
  NProgress.done()
})
