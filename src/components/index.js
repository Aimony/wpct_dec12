/**
 * 全局组件挂载
 */

import UploadExcel from './UploadExcel/index.vue'

export default {
  install(Vue) {
    Vue.component('UploadExcel', UploadExcel)
  }
}
