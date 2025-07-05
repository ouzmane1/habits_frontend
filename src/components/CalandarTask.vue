<template>
  <div>
    <el-calendar v-model="value">
      <template #date-cell="{ data }">
        <div class="calendar-cell">
          <span :class="{ 'completed-day': isCompletedDay(data.day) }">
            {{ data.day.split('-').slice(2).join('') }}
          </span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>
  
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import ItemService from '@/services/item.service.js'

const value = ref(new Date())
const completedTasks = ref([])
const completedDays = ref(new Set())

const loadCompletedTasks = async () => {
  try {
    const tasksData = await ItemService.getCompletedtask()
    console.log('Tâches complétées pour le calendrier:', tasksData)
    completedTasks.value = tasksData || []
    
    // Extraire les dates uniques des tâches complétées
    const days = new Set()
    if (Array.isArray(tasksData)) {
      tasksData.forEach(task => {
        if (task.date) {
          // La date est déjà au format YYYY-MM-DD
          days.add(task.date)
        }
      })
    }
    completedDays.value = days
    console.log('Jours avec tâches complétées:', Array.from(days))
  } catch (error) {
    console.error('Erreur lors du chargement des tâches complétées:', error)
  }
}

const isCompletedDay = (dayString: string) => {
  return completedDays.value.has(dayString)
}

onMounted(() => {
  loadCompletedTasks()
})
</script>

<style scoped>
.calendar-cell {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.completed-day {
  background-color: #10b981;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
</style>
  