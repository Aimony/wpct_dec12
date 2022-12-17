/*
 * @Author: Your Name you@example.com
 * @Date: 2021-11-18 23:21:54
 * @LastEditors: Your Name you@example.com
 * @LastEditTime: 2022-11-03 23:22:21
 * @FilePath: \vue-admin-template-master\src\store\getters.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  permissions: state => state.user.permissions,

  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  routers: state => state.permission.routers,
  promissionRole: state => state.user.promissions
}
export default getters
