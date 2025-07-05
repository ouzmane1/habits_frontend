<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-8">
        <WelcomeSlider
          userName=""
          :showChallengeButton="true"
          :onChallengeClick="handleChallengeClick"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-1">
          <CalandarTask />
        </div>
          
        <div className="lg:col-span-1">
          <TaskList />
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import ItemService from '@/services/item.service.js'

import WelcomeSlider from '@/components/WelcomeSlider.vue'
import TaskList from '@/components/TaskList.vue'
import CalandarTask from '@/components/CalandarTask.vue'

const router = useRouter()

const handleChallengeClick = () => {
  router.push('/defis')
}

// Fonction pour récupérer et afficher les tâches d'aujourd'hui
const loadTodayTasks = async () => {
  try {
    const tasks = await ItemService.getTodaytask()
    console.log('Tâches d\'aujourd\'hui:', tasks)
  } catch (error) {
    console.error('Erreur lors du chargement des tâches:', error)
  }
}

// Appeler la fonction au montage du composant
onMounted(() => {
  loadTodayTasks()
})
</script>
