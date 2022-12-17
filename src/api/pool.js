import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/pooled/list',
    method: 'get',
    params
  })
}

export function updatePool(data, params) {
  return request({
    url: '/pooled/update',
    method: 'post',
    data,
    params
  })
}

export function addPool(data, params) {
  return request({
    url: '/pooled/add',
    method: 'post',
    data,
    params
  })
}

export function removePool(params) {
  return request({
    url: '/pooled/remove',
    method: 'get',
    params
  })
}

export function searchPool(params) {
  return request({
    url: '/pooled/cost',
    method: 'post',
    params
  })
}
