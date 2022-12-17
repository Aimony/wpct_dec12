import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'check/blist',
    method: 'post',
    params
  })
}

export function deleteRow(params) {
  return request({
    url: '/check/delete',
    method: 'post',
    params
  })
}

export function addRow(data) {
  return request({
    url: '/check/add',
    method: 'post',
    data
  })
}

export function updateRow(data) {
  return request({
    url: '/check/update',
    method: 'post',
    data
  })
}
