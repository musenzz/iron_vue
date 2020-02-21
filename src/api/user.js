import request from '@/utils/request'

export function doLogin (data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function doGetBaseInfo (token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}
