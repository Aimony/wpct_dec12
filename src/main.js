/*
 * @Author: Your Name you@example.com
 * @Date: 2021-11-18 23:21:54
 * @LastEditors: Your Name you@example.com
 * @LastEditTime: 2022-12-16 10:31:40
 * @FilePath: \vue-admin-template-master\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import { getToken, setToken, removeToken } from '@/utils/auth'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css
import { Message } from 'element-ui'
import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

// 全局注册组件
import UploadExcel from '@/components/index.js'
Vue.use(UploadExcel)

// 使用 vue-json-excel
import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.directive("premission", {

  bind: async function (el, binding, vnode) {
    let { expression } = binding;
    expression = expression.replace(/\'/g, "");
    //这个arr是登录后获取的权限列表 可以自定义方法获取 *:*
    //后面要修改，不然不安全  
    try {
      const arr = store.getters.promissionRole || localStorage.getItem('promisssion') || ["user:list"];
      let results = arr.find(item => {
        return item == '*:*'
      })
      if (results) {
        return
      }
      else {
        if (!arr.find((item) => item.includes(expression))) {
          setTimeout(() => {
            el.parentNode.removeChild(el);
          }, 0);
        }
      }
    } catch (error) {
      removeToken()
      return router.push('/login')
    }



  },
});


Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

