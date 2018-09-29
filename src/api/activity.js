import request from '@/utils/request'

/**
 * 新增促销活动
 * @param params
 */
export function addActivityInfo(data) {
  return request({
    url: '/activityInfoController/addActivityInfo',
    method: 'post',
    data
  })
}

/**
 * 修改促销活动
 * @param params
 */
export function updateActivityInfo(data) {
  return request({
    url: '/activityInfoController/updateActivityInfo',
    method: 'post',
    data
  })
}

/**
 * 查询酒店促销活动列表
 * @param params
 */
export function getActivityInfoList(params) {
  return request({
    url: '/activityInfoController/getActivityInfoList',
    method: 'post',
    params
  })
}

/**
 * 查询单个促销活动明细
 * @param id
 */
export function getActivityInfo(id) {
  return request({
    url: '/activityInfoController/selectByPrimaryKey',
    method: 'post',
    params: {
      activityId: id
    }
  })
}
