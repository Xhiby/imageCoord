import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: 'quickStart'
    },
    {
      path: '/quickStart',
      component: () => import('../views/quickStart/index.vue')
    },
    {
      path: '/props',
      component: () => import('../views/props/index.vue')
    }
  ]
})

export default router
