<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-white to-primary/5">
    <!-- Barre de navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="font-bold text-xl text-gradient-primary">HabitTracker</router-link>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-gray-600">{{ user?.email }}</span>
            <Button 
              @click="handleLogout" 
              variant="outline"
              class="text-red-600 border-red-200 hover:bg-red-50"
            >
              Se déconnecter
            </Button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenu principal -->
    <main class="flex-1 p-6">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h1 class="text-2xl font-bold text-gray-800 mb-6">
            Bienvenue sur votre tableau de bord !
          </h1>

          <div class="space-y-4">
            <div class="p-4 bg-gray-50 rounded-lg">
              <h2 class="text-lg font-semibold text-gray-700 mb-2">Votre session</h2>
              <p class="text-sm text-gray-600">
                Vous êtes connecté avec succès. Votre token est valide.
              </p>
            </div>

            <!-- Vous pouvez ajouter ici d'autres sections de votre dashboard -->
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '@/services/auth.service'
import Button from '@/components/ui/Button.vue'

const router = useRouter()
const user = ref(null)

onMounted(() => {
  const currentUser = AuthService.getCurrentUser()
  if (!currentUser) {
    router.push('/auth')
    return
  }
  user.value = currentUser
})

const handleLogout = () => {
  AuthService.logout()
  router.push('/auth')
}
</script>

<style scoped>
.text-gradient-primary {
  background: linear-gradient(to right, var(--primary), var(--primary-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style> 