<template>
  <nav class="bg-white shadow-lg border-b border-border sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <RouterLink
          to="/"
          class="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent"
        >
          Habits
        </RouterLink>

        <div class="flex space-x-8">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200"
            :class="{
              'bg-emerald-100 text-emerald-700 font-medium': isActive(item.path),
              'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50': !isActive(item.path)
            }"
          >
            <component :is="item.icon" :size="20" />
            <span>{{ item.label }}</span>
          </RouterLink>
        </div>

        <div class="flex items-center">
          <Button 
            @click="handleLogout" 
            class="text-gray-500 hover:text-gray-700"
          >
            <LogOut class="mr-2" :size="18" />
            Déconnexion
          </Button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { Home, CheckSquare, Target, Award } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import AuthService from '@/services/auth.service'

const route = useRoute()
const router = useRouter()

const navItems = [
  { path: '/', label: 'Accueil', icon: Home },
  { path: '/mes-taches', label: 'Mes Tâches', icon: CheckSquare },
  { path: '/defis', label: 'Défis', icon: Target },
  { path: '/badges', label: 'Badges', icon: Award },
]

const isActive = (path: string) => route.path === path

const handleLogout = () => {
  AuthService.logout()
  router.push('/auth')
}
</script>
