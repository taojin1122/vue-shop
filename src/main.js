import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 引入第三方图标库
import './assets/fonts/iconfont.css'
// 引入全局样式表
import './assets/css/global.css'
// 引入treeTable组件
import TreeTable from 'vue-table-with-tree-grid'

// 引入 富文本编辑器组件
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 导入axios
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
// 请求拦截器
// 为请求添加Authorization属性，进行授权
axios.interceptors.request.use(config => {
  console.log(config)
  // 最后必须return config
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 将axios挂载到vue对象上 之后直接只用$http发起请求
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 通过Vue.component 注册为全局可用组件
Vue.component('tree-table', TreeTable)
// 将富文本编辑器注册为全局可用组件
Vue.use(VueQuillEditor)

// 定义全局的时间过滤器
Vue.filter('dateFormat', function(originValue) {
  const dt = new Date(originValue)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2,'0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  // 通过router 配置参数输入路由
  // 从而让整个应用都有路由功能
  router,
  // render 函数渲染app组件
  render: h => h(App)
}).$mount('#app')
