/*
 * @Author: Your Name you@example.com
 * @Date: 2022-11-05 21:48:50
 * @LastEditors: Your Name you@example.com
 * @LastEditTime: 2022-11-06 13:51:15
 * @FilePath: \vue-admin-template-master\src\api\bill.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from "@/utils/request";

export function getBillListAPI(params) {
  return request({
    url: "/check/blist",
    method: "post",
    params,
  });
}


export function deleteBillAPI(params) {
  return request({
    url: "/check/delete",
    method: "post",
    params,
  });
}

export function addBillItem(value) {
  return request({
    url: "/check/add",
    method: "post",
    data: value
  });
}

export function updateBillItem(value) {
  return request({
    url: "/check/update",
    method: "post",
    data: value
  });
}