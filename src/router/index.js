import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import UserList from '../components/UserList.vue'
import Rights from '../components/Rights.vue'
import Roles from '../components/Roles.vue'

Vue.use(VueRouter)

// 定义路由规则
const routes = [
  // 重定向  根路径重定向到/login
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    // 重定向到welcome页
    redirect: '/welcome',
    // 定义子路由，需要在home组件中设置子组件的占位符 router-view
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: UserList
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 路由导航守卫 进行权限控制
router.beforeEach((to, from, next) => {
  // to 将要访问的页面
  // from 从那个页面来
  // next 是一个函数 表示放行
  // next() 放行     next('/login') 强制放行
  if (to.path === '/login') return next()
  const sessionStr = window.sessionStorage.getItem('token')
  console.log(sessionStr)
  if (!sessionStr) return next('/login')
  next()
})

export default router
