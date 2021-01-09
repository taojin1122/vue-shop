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

new Vue({
  // 通过router 配置参数输入路由
  // 从而让整个应用都有路由功能
  router,
  // render 函数渲染app组件
  render: h => h(App)
}).$mount('#app')
