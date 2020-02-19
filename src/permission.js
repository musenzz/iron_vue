// 在路由发生变化时进行一些特殊处理而定义的函数。跳转之前执行
import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
router.beforeEach(() => {
  NProgress.start()
})

// 跳转之后执行
router.afterEach(() => {
  NProgress.done()
})
