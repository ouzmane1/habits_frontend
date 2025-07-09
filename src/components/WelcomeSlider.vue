<template>
    <div class="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl p-8 text-white shadow-lg">
      <div class="flex items-center justify-between flex-col sm:flex-row gap-4 sm:gap-0">
        <div>
          <h1 class="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
            Bonjour, {{ userName }} ! 👋
          </h1>
          <p class="text-emerald-100 text-base sm:text-lg">
            Prêt à conquérir vos habitudes aujourd'hui ?
          </p>
        </div>
  
        <Button
          v-if="showChallengeButton"
          @click="onChallengeClick"
          class="bg-white text-emerald-600 hover:bg-emerald-50 font-medium px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base rounded-xl transition-all duration-200 hover:scale-105"
        >
          Voir les défis
          <ChevronRight class="ml-2" :size="18" />
        </Button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import Button from '@/components/ui/Button.vue'
  import { ChevronRight } from 'lucide-vue-next'
  import { ref, onMounted } from 'vue'
  import AuthService from '@/services/auth.service'

  const userName = ref('')

// Appelle le service AuthService à l'ouverture du composant
onMounted(async () => {
  try {
    const response = await AuthService.getUserInfo()
    console.log('Réponse API /me :', response)
    userName.value = response.name
  } catch (error) {
    console.error('Erreur de récupération du profil :', error)
  }
})
  
  defineProps<{
    showChallengeButton?: boolean
    onChallengeClick?: () => void
  }>()
  </script>
  