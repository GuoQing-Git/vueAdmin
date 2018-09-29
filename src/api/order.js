import request from '@/utils/request'

/**
 * 订单列表
 * @param params
 */
export function getOrderList(params) {
  return request({
    url: '/orderInfoController/getOrderAll',
    method: 'post',
    data: {},
    params: params
  })
}

/**
 * 接单
 * @param orderId
 */
export function receiptOrder(orderId) {
  return request({
    url: '/orderInfoController/receiptOrderInfo',
    method: 'post',
    data: {},
    params: {
      orderId: orderId
    }
  })
}

/**
 * 拒单
 * @param orderId
 */
export function refusalOrder(orderId) {
  return request({
    url: '/orderInfoController/refusalOrderInfo',
    method: 'post',
    data: {},
    params: {
      orderId: orderId
    }
  })
}

/**
 * 确认入住
 * @param orderId
 */
export function updateRz(orderId) {
  return request({
    url: '/orderInfoController/updateRz',
    method: 'post',
    data: {},
    params: {
      orderId: orderId
    }
  })
}

/**
 * 今日总计
 */
export function getCount() {
  return request({
    url: '/orderInfoController/getCount',
    method: 'post'
  })
}
