import request from '@/utils/request'

export function login(userName, password) {
  return request({
    url: '/userloginPc',
    method: 'post',
    data: {
      userName,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout(token) {
  return request({
    url: '/loginout',
    method: 'post',
    params: {
      token
    }
  })
}
