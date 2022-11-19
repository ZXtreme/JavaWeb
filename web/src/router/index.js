import Vue from 'vue'
import VueRouter from 'vue-router'
import MainPage from '../views/MainPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: MainPage,
    beforeEnter: (to, from, next) => {
      const id = localStorage.getItem('id') * 1
      if (id === 10000) next('/management')
      else next()
    }
  },
  {
    path: '/login',
    component: () => import('../views/AboutLogin.vue')
  },
  {
    path: '/management',
    component: () => import('../views/ManagePage.vue'),
    beforeEnter: (to, from, next) => {
      const id = localStorage.getItem('id') * 1
      if (id === 10000) next()
      else next('/login')
    }
  },
  {
    path: '/detail/:id',
    component: () => import('../views/GoodsDetail.vue'),
    props: true
  }
]

const router = new VueRouter({
  routes
})

export default router
