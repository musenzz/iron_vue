import Vue from 'vue'
import Router from 'vue-router'
import User from '@/components/user/User'
import UserProfile from '@/components/user/UserProfile'
import UserPosts from '@/components/user/UserPosts'
import Index from '@/views/dashboard/index'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/',
    component: Index,
    name: 'index'
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {path: '/user/:id',
    component: User,
    name: 'User',
    children: [{
      path: 'profile',
      component: UserProfile
    }, {
      // 当 /user/:id/posts 匹配成功
      // UserPosts 会被渲染在 User 的 <router-view> 中
      path: 'posts',
      component: UserPosts
    }]
  }
]

export default new Router({
  routes: constantRoutes
})
