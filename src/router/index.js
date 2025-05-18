import { createRouter, createWebHistory } from 'vue-router'

const routes = [
//   {
//     path: '/',
//     name: 'Home',
//     component: () => import('@/views/Home.vue')
//   },
  { path: '/',
    component: () => import('@/page/Auth.vue')
},
  // Ajoute tes autres routes
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router