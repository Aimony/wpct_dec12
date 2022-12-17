import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/deposit/blist',
    method: 'post',
    params
  })
}

export function removeDeposit(params, data) {
  return request({
    url: '/deposit/delete',
    method: 'post',
    params,
    data
  })
}
