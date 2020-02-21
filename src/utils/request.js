import axios from 'axios'
import store from '@/store'
import Vue from 'vue'
import {Message, MessageBox} from 'element-ui'
import {getToken} from './cookies'

Vue.prototype.$axios = axios // 将axios挂载在Vue实例原型上

const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 5 * 1000 * 60
})

service.interceptors.request.use(function (config) {
  if (store.getters.token) {
    config.headers['X-Token'] = getToken()
  }
  return config
}, function (error) {
  // do something with request error
  console.log(error) // for debug
  return Promise.reject(error)
}
)

service.interceptors.response.use(function (response) {
  const res = response.data

  if (res.code !== 20000) {
    Message({
      message: res.message || 'Error',
      type: 'error',
      duration: 30 * 1000
    })

    // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      // to re-login
      MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
        confirmButtonText: 'Re-Login',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
        return Promise.reject(new Error(res.message || 'Error'))
      }
    }
  } else {
    return res
  }
}, function (error) {
  Message({
    message: error.message,
    type: 'error',
    duration: 30 * 1000
  })
  return Promise.reject(error)
}
)

export default service
