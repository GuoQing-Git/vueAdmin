import request from '@/utils/request'

/**
 * 房型列表数据
 * @param params
 */
export function getRoomList(params) {
  return request({
    url: '/fxInfoController/getFxInfoList',
    method: 'post',
    params
  })
}

/**
 * 新增房型信息
 * @param data
 */
export function addRoomInfo(data) {
  return request({
    url: '/fxInfoController/addFxInfo',
    method: 'post',
    data
  })
}

/**
 * 修改房型信息
 * @param data
 */
export function updateRoomInfo(data) {
  return request({
    url: '/fxInfoController/updateFxInfo',
    method: 'post',
    data
  })
}

/**
 * 删除房型信息
 * @param id
 */
export function deleteRoomInfo(id) {
  return request({
    url: '/fxInfoController/deleteFxInfoUp',
    method: 'post',
    params: {
      fxId: id
    }
  })
}

/**
 * 获取单个房型信息
 * @param id
 */
export function getRoomInfo(id) {
  return request({
    url: '/fxInfoController/getFxInfo',
    method: 'get',
    params: {
      fxId: id
    }
  })
}

/**
 * 获取字典表数据
 * @param id
 */
export function getDataDictionary(id) {
  return request({
    url: '/dataDictionaryTableController/getDataDictionaryTableList',
    method: 'post',
    params: {
      field: id
    }
  })
}

/**
 * 获取价格日历
 * @param params
 */
export function getCalendarList(params) {
  return request({
    url: '/fxCalendarController/getFxCalendarList',
    method: 'post',
    params
  })
}

/**
 * 修改价格日历
 * @param data
 */
export function editPriceCalender(data) {
  return request({
    url: '/fxYsInfoController/addUpFxPriceCalendar',
    method: 'post',
    data
  })
}

/**
 * 批量修改价格日历
 * @param data
 */
export function batchEditPriceCalender(data) {
  return request({
    url: 'fxYsInfoController/addUpAll',
    method: 'post',
    data
  })
}

/**
 * 房型停售/开售
 * @param fxId
 * @param roomStatus
 */
export function stopFxInfo(fxId, roomStatus) {
  return request({
    url: 'fxInfoController/stopFxInfo',
    method: 'post',
    params: {
      fxId: fxId,
      roomStatus: roomStatus
    }
  })
}
