import { createRouter, createWebHistory } from 'vue-router'
import AuthService from '@/services/auth.service'

// Import dynamique des composants
const Auth = () => import('@/page/Auth.vue')
const Dashboard = () => import('@/page/Dashboard.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/auth',
      name: 'auth',
      component: Auth,
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true }
    },

  ]
})

// Navigation guard pour protéger les routes
router.beforeEach(async (to, from, next) => {
  const isAuthenticated = AuthService.isAuthenticated()
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/auth')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router