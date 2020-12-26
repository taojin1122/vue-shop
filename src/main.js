import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

Vue.config.productionTip = false

new Vue({
  // 通过router 配置参数输入路由
  // 从而让整个应用都有路由功能
  router,
  
  render: h => h(App)
}).$mount('#app')
