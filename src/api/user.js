/*
 * @Author: Your Name you@example.com
 * @Date: 2021-11-18 23:21:54
 * @LastEditors: Your Name you@example.com
 * @LastEditTime: 2022-10-30 19:42:50
 * @FilePath: \vue-admin-template-master\src\api\user.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'

export function login(data) {
  console.log(data)
  return request({
    url: 'log/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'role/listRole',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: 'log/logout',
    method: 'post'
  })
}
