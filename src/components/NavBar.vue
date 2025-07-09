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

        <!-- Bouton burger visible sur mobile -->
        <button
          class="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
          @click="isMenuOpen = !isMenuOpen"
          aria-label="Ouvrir le menu"
        >
          <span :class="[isMenuOpen ? 'rotate-45 translate-y-2' : '', 'block w-6 h-0.5 bg-gray-800 transition-all duration-300 mb-1']"></span>
          <span :class="[isMenuOpen ? 'opacity-0' : '', 'block w-6 h-0.5 bg-gray-800 transition-all duration-300 mb-1']"></span>
          <span :class="[isMenuOpen ? '-rotate-45 -translate-y-2' : '', 'block w-6 h-0.5 bg-gray-800 transition-all duration-300']"></span>
        </button>

        <!-- Menu de navigation -->
        <div
          class="items-center md:flex md:flex-row md:space-x-8 md:static md:w-auto transition-all duration-300 z-40"
          :class="[
            isMenuOpen ? 'flex flex-col absolute top-16 right-0 w-3/4 max-w-xs bg-white shadow-lg' : 'hidden',
            'md:flex md:flex-row md:relative md:bg-transparent md:shadow-none'
          ]"
        >
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200"
            :class="{
              'bg-emerald-100 text-emerald-700 font-medium': isActive(item.path),
              'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50': !isActive(item.path)
            }"
            @click="isMenuOpen = false"
          >
            <component :is="item.icon" :size="20" />
            <span>{{ item.label }}</span>
          </RouterLink>

          <div class="flex items-center space-x-4 ml-6 border-l border-gray-200 pl-6">
            <!-- Icône de notification -->
            <button class="relative p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200">
              <Bell :size="20" />
              <!-- Badge de notification (optionnel) -->
              
            </button>

            <!-- Menu utilisateur -->
            <DropdownMenu align="end">
              <template #trigger>
                <button class="flex items-center space-x-2 p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200">
                  <Avatar
                    
                    alt="Profile" 
                    class="h-8 w-8"
                    fallback-class="bg-emerald-100 text-emerald-700"
                  >
                    <User :size="16" />
                  </Avatar>
                </button>
              </template>
              
              <template #content>
                <button 
                  @click="handleProfile"
                  class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground w-full text-left"
                >
                  <User :size="16" class="mr-2" />
                  Mon Profil
                </button>
                
                <div class="-mx-1 my-1 h-px bg-muted"></div>
                
                <button 
                  @click="handleLogout"
                  class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground w-full text-left text-red-600"
                >
                  <svg 
                    class="mr-2 h-4 w-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Déconnexion
                </button>
              </template>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { Home, CheckSquare, Target, Award, User, Bell } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import AuthService from '@/services/auth.service'
import DropdownMenu from './ui/DropdownMenu.vue'
import Avatar from './ui/Avatar.vue'
import { ref } from 'vue'

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

const handleProfile = () => {
  router.push('/profil')
}

const isMenuOpen = ref(false)
</script>

<style scoped>
@media (max-width: 768px) {
  .space-x-8 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-x-reverse: 0;
    margin-right: 0;
    margin-left: 0;
  }
  .ml-6 {
    margin-left: 0 !important;
  }
  .border-l {
    border-left: none !important;
  }
  .pl-6 {
    padding-left: 0 !important;
  }
  .max-w-xs {
    max-width: 12rem;
  }
}
</style>
