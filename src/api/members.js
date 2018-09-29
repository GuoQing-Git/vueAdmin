import request from '@/utils/request'

/*
 * 会员列表
*/
export function getMembersList(params) {
  return request({
    url: '/userInfoController/getUserInfoList',
    method: 'post',
    params
  })
}

/*
 * 获取单个信息
*/
export function selectById(params) {
  return request({
    url: '/userInfoController/selectById',
    method: 'post',
    params
  })
}

/*
 * 修改
*/
export function updateUserInfo(data) {
  return request({
    url: '/userInfoController/updateUserInfo',
    method: 'post',
    data
  })
}

/*
 * 发送优惠券
*/
export function addActivityInfoYh(data) {
  return request({
    url: '/activityInfoController/addActivityInfoYh',
    method: 'post',
    data
  })
}

/*
 * 修改密码
*/
export function updatePass(data) {
  return request({
    url: '/bUserInfoController/updatePass',
    method: 'post',
    data
  })
}
