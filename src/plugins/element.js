import Vue from 'vue'
import { Button, Form, FormItem, Input, Message, Container, Header, Aside, Main, Menu, MenuItem, MenuItemGroup, Submenu, Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn, Switch, Tooltip, Pagination, Dialog, MessageBox, Tag, Tree, Select, Option } from 'element-ui'
// // 按需导入组件
// import { Form, FormItem } from 'element-ui'
// import { Input } from 'element-ui'
// // 注册为全局可用组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(BreadcrumbItem)
Vue.use(Breadcrumb)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
// 将message 进行全局挂载 自定义的$message 属性
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
