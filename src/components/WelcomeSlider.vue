<template>
    <div class="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl p-8 text-white shadow-lg">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold mb-2">
            Bonjour, {{ userName }} ! 👋
          </h1>
          <p class="text-emerald-100 text-lg">
            Prêt à conquérir vos habitudes aujourd'hui ?
          </p>
        </div>
  
        <Button
          v-if="showChallengeButton"
          @click="onChallengeClick"
          class="bg-white text-emerald-600 hover:bg-emerald-50 font-medium px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105"
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
  import axios from 'axios'

  const userName = ref('')

// Appelle l’API à l’ouverture du composant
onMounted(async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const response = await axios.get('http://127.0.0.1:8000/api/me', {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
    userName.value = response.data.name
  } catch (error) {
    console.error('Erreur de récupération du profil :', error)
  }
})
  
  defineProps<{
    showChallengeButton?: boolean
    onChallengeClick?: () => void
  }>()
  </script>
  