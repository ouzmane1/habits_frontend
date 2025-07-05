import { createRouter, createWebHistory } from 'vue-router'
import AuthService from '@/services/auth.service'

// Import dynamique des composants
const Auth = () => import('@/page/Auth.vue')
const Accueil = () => import('@/page/Accueil.vue')
const MesTaches = () => import('@/page/MesTaches.vue')
const Defis = () => import('@/page/Defis.vue')
const DefisDetail = () => import('@/page/DefisDetail.vue')
const Badges = () => import('@/page/Badges.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/auth',
      name: 'auth',
      component: Auth,
      meta: { requiresGuest: true }
    },
    {
      path: '/home',
      name: 'home',
      component: Accueil,
      meta: { requiresAuth: true }
    },
    {
      path: '/mes-taches',
      name: 'mes-taches',
      component: MesTaches,
      meta: { requiresAuth: true }
    },
    {
      path: '/defis',
      name: 'defis',
      component: Defis,
      meta: { requiresAuth: true }
    },
    {
      path: '/defis/:id',
      name: 'DefisDetail',
      component: DefisDetail,
      meta: { requiresAuth: true }
    },
    {
      path: '/badges',
      name: 'badges',
      component: Badges,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = AuthService.isAuthenticated()

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/auth')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/home')
  } else {
    next()
  }
})

export default router