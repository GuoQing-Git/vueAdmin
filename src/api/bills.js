import request from '@/utils/request'

/*
 * 会员列表
*/
export function getBillList(params) {
  return request({
    url: '/orderInfoController/getSettlementPageByDate',
    method: 'post',
    params
  })
}

/**
 * 结算统计
 * @param params
 */
export function getSettlement(params) {
  return request({
    url: '/orderInfoController/getSettlementByDate',
    method: 'post',
    params
  })
}
