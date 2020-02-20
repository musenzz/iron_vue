import request from '@/utils/request'

export function doLogin (data) {
  console.log('------ffff----------')
  console.log(data)
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}
