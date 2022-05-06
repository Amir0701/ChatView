import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/Login'
import {authGuard, notFound, /*redirectFromLogin*/} from "@/router/authGuard"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: 'chat'
  },
  {
    path: '/auth',
    name: 'auth',
    component: Login,
    //beforeEnter: redirectFromLogin
  },
  {
    path: '/chat',
    name: 'chats',
    component: () => import('@/views/Chats'),
    beforeEnter: authGuard
  },
  {
    path: '*',
    beforeEnter: notFound
  },
  { // 404
    path: '/not-found',
    component: () => import('@/views/NotFound')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
