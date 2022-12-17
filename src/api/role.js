/*
 * @Author: Your Name you@example.com
 * @Date: 2022-11-06 15:23:41
 * @LastEditors: Your Name you@example.com
 * @LastEditTime: 2022-11-09 08:32:17
 * @FilePath: \vue-admin-template-master\src\api\role.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'

export function getUserRole(data) {
  // console.log(data)
  return request({
    url: '/role/listRole',
    method: 'get',
  })
}

export function addUserRole(data) {
  // console.log(data)
  return request({
    url: '/role/add',
    method: 'post',
    data: data
  })
}
export function deleteUserRole(ID) {
  // console.log(data)
  return request({
    url: '/role/remove',
    method: 'get',
    params: { ID: ID }
  })
}

export function getUserRoleList(data) {
  // console.log(data)
  return request({
    url: '/role/perms',
    method: 'get',

  })
}