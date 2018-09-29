import request from '@/utils/request'

/**
 * 获取字典表数据
 * @param type 字典表对应的字段
 */
export function getDataDictionary(type) {
  return request({
    url: '/dataDictionaryTableController/getDataDictionaryTableList',
    method: 'post',
    params: {
      field: type
    }
  })
}

/**
 * 获取地址数据
 */
export function getCityInfoAll() {
  return request({
    url: '/cityInfoController/getCityInfoAll',
    method: 'post'
  })
}

/**
 * 根据地址获取经纬度
 */
export function getLocationByCity(data) {
  return request({
    url: '/getLocationController/getLocationByCity',
    method: 'post',
    params: {
      address: data
    }
  })
}

/**
 * 根据经纬度获取地址
 */
export function getCityByLocation(lat, lng) {
  return request({
    url: '/getLocationController/getCityByLocation',
    method: 'post',
    params: {
      lat: lat,
      lng: lng
    }
  })
}
