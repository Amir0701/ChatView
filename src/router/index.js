import { createRouter, createWebHashHistory } from 'vue-router'

import store from '@/store'
import { GETTERS } from '@/store/modules/auth/constants'

import Login from '@/views/Login';

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

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters[`auth/${GETTERS.IS_AUTHENTICATED}`]

  if (!isAuthenticated && to.path !== '/login') next({ name: 'login' })
  else if (isAuthenticated && to.path !== '/chats') next({ name: 'chats' })
  else next()
})

export default router
