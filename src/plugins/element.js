import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'
// // 按需导入组件
// import { Form, FormItem } from 'element-ui'
// import { Input } from 'element-ui'
// // 注册为全局可用组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 将message 进行全局挂载 自定义的$message 属性
Vue.prototype.$message = Message
