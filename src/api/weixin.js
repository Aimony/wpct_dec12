import request from "@/utils/request";


export const getWeixinlistAPI = () => {
  return request({
    url: '/wenxin/binfo',
    method: 'get',
  })
}


