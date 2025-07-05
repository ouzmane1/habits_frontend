<template>
    <div class="p-6 rounded-lg bg-card text-card-foreground shadow-xl">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-800">Mes Habitudes</h3>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700">
            {{ completedCount }}/{{ habits.length }}
          </span>
          <span class="text-sm text-gray-500">{{ completionRate }}%</span>
        </div>
      </div>
  
      <!-- État de chargement -->
      <div v-if="loading" class="flex justify-center items-center py-8">
        <div class="text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p class="text-gray-600 text-sm">Chargement des tâches...</p>
        </div>
      </div>

      <!-- État d'erreur -->
      <div v-else-if="error" class="text-center py-8">
        <div class="text-red-600 mb-4">
          <p class="text-sm">{{ error }}</p>
        </div>
        <button @click="loadTodayTasks" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
          Réessayer
        </button>
      </div>

      <!-- Liste des tâches -->
      <div v-else-if="habits.length > 0" class="space-y-3">
        <div
          v-for="habit in habits"
          :key="`${habit.type}-${habit.id}`"
          :class="`flex items-center gap-4 p-3 rounded-lg border transition-all duration-200 ${
            habit.completed
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`"
        >
          <label class="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              :checked="habit.completed"
              @change="toggleHabit(habit.id, habit.type)"
              class="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
          </label>
          
          <div class="flex-1">
            <span :class="`font-medium ${
              habit.completed ? 'text-emerald-700 line-through' : 'text-gray-800'
            }`">
              {{ habit.title }}
            </span>
            <div class="text-xs text-gray-500 mt-1">
              {{ habit.type === 'habit' ? 'Habitude' : 'Objectif' }}
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">🔥</span>
            <span class="text-sm font-medium text-orange-600">
              {{ habit.streak || 0 }} jours
            </span>
          </div>
        </div>
      </div>

      <!-- État vide -->
      <div v-else class="text-center py-8">
        <div class="text-gray-500">
          <p class="text-sm">Aucune tâche pour aujourd'hui</p>
          <p class="text-xs text-gray-400 mt-1">Créez de nouvelles habitudes pour commencer !</p>
        </div>
      </div>
  
      <div v-if="habits.length > 0" class="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg">
        <p class="text-sm text-center text-gray-600">
          Continuez ainsi ! Chaque jour compte pour atteindre vos objectifs 💪
        </p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import ItemService from '@/services/item.service.js'
  
  interface Habit {
    id: number
    title: string
    name?: string
    completed: boolean
    streak?: number
    type: string
  }
  
  const habits = ref<Habit[]>([])
  const loading = ref(true)
  const error = ref('')
  
  const loadTodayTasks = async () => {
    try {
      loading.value = true
      error.value = ''
      const tasksData = await ItemService.getTodaytask()
      console.log('Tâches d\'aujourd\'hui reçues:', tasksData)
      habits.value = tasksData || []
    } catch (err) {
      console.error('Erreur lors du chargement des tâches:', err)
      error.value = 'Erreur lors du chargement des tâches'
      habits.value = []
    } finally {
      loading.value = false
    }
  }
  
  const toggleHabit = async (id: number, type: string) => {
    const habitIndex = habits.value.findIndex(habit => habit.id === id && habit.type === type)
    if (habitIndex !== -1) {
      const habit = habits.value[habitIndex]
      const newCompletedState = !habit.completed
      
      // Mise à jour immédiate de l'interface pour une meilleure UX
      habit.completed = newCompletedState
      
      try {
        if (newCompletedState) {
          // Coche = enregistre le log
          await ItemService.logTaskDay(type, id)
          console.log(`Log enregistré pour ${type} ${id}`)
        } else {
          // Décoche = supprime le log
          await ItemService.deleteTaskLog(type, id)
          console.log(`Log supprimé pour ${type} ${id}`)
        }
      } catch (error) {
        console.error('Erreur lors de la modification du log:', error)
        // Revenir à l'état précédent en cas d'erreur
        habit.completed = !newCompletedState
        alert('Erreur lors de la modification de la tâche. Veuillez réessayer.')
      }
    }
  }
  
  const completedCount = computed(() => {
    return habits.value.filter(h => h.completed).length
  })
  
  const completionRate = computed(() => {
    return habits.value.length > 0 ? Math.round((completedCount.value / habits.value.length) * 100) : 0
  })
  
  onMounted(() => {
    loadTodayTasks()
  })
  </script>