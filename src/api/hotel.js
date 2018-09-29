import request from '@/utils/request'

/**
 * 获取酒店信息
 */
export function getHotelInfo() {
  return request({
    url: '/shopInfoController/getShopInfo',
    method: 'get',
    params: {
      shopId: ''
    }
  })
}

/**
 * 修改酒店信息
 * @param data
 */
export function updateHotelInfo(data) {
  return request({
    url: '/shopInfoController/updateShopInfo',
    method: 'post',
    data
  })
}

/**
 * 地址数据
 */
export function getCityInfoAll() {
  return request({
    url: '/cityInfoController/getCityInfoAll',
    method: 'post'
  })
}

/**
 * 设施数据
 */
export function getFacilitiesData() {
  return request({
    url: '/dataDictionaryTableController/getMapDataDictionary',
    method: 'post'
  })
}

/**
 * 获取所有分类下的图片
 */
export function getImageTypeList() {
  return request({
    url: '/fileImageController/getImageTypeList',
    method: 'post',
    params: {
      shopId: ''
    }
  })
}

/**
 * 新增图片
 * @param data
 */
export function addFileImage(data) {
  return request({
    url: '/fileImageController/addFileImage',
    method: 'post',
    data
  })
}

/**
 * 查询类别
 */
export function selectFileImageType(params) {
  return request({
    url: '/fileImageTypeController/selectFileImageType',
    method: 'post',
    params
  })
}

/**
 * 新增类别
 * @param data
 */
export function addFileImageType(data) {
  return request({
    url: '/fileImageTypeController/addFileImageType',
    method: 'post',
    data
  })
}

/**
 * 修改类别
 * @param data
 */
export function updateFileImageType(data) {
  return request({
    url: '/fileImageTypeController/updateFileImageType',
    method: 'post',
    data
  })
}

/*
 * 分类列表
*/
export function getFileImageTypeList(params) {
  return request({
    url: '/fileImageTypeController/getFileImageTypeList',
    method: 'post',
    params
  })
}
