import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Assentos from '../components/Assentos.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/assentos',
      name: 'assentos',
      component: Assentos
    }
  ]
})

export default router