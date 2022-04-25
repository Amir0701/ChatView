import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/Login';
import * as AUTH_CONSTANTS from "@/store/modules/auth/constants";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: 'chats'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/chats',
    name: 'chats',
    component: () => import('@/views/Chats')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem(AUTH_CONSTANTS.LOCALSTORAGE_KEY)

  if (!isAuthenticated && to.path !== '/login') next({ name: 'login' })
  else if (isAuthenticated && to.path !== '/chats') next({ name: 'chats' })
  else next()
})

export default router
