/*
 * @Author: Your Name you@example.com
 * @Date: 2022-11-06 14:08:50
 * @LastEditors: Your Name you@example.com
 * @LastEditTime: 2022-11-06 14:48:55
 * @FilePath: \vue-admin-template-master\src\api\myuser.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'

export function getUserList(e) {
  return request({
    url: '/user/list',
    method: 'get',
    params: {
      pageNum: e
    }
  })
}

export function addUserList(value) {
  console.log(value)
  return request({
    url: '/user/add',
    method: 'post',
    data: value
  })
}
export function deleteUserList(ID) {
  return request({
    url: '/user/remove',
    method: 'get',
    params: { ID: ID }
  })
}

export function updateUserList(value) {
  return request({
    url: '/user/update',
    method: 'post',
    data: value
  })
}