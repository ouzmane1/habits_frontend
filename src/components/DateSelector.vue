<template>
    <div class="space-y-2">
      <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {{ label }}
      </label>
      <div class="relative">
        <button
          type="button"
          @click="toggleCalendar"
          :class="[
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            'justify-start text-left font-normal',
            !selectedDate && 'text-muted-foreground'
          ]"
        >
          <CalendarIcon class="mr-2 h-4 w-4" />
          {{ selectedDate ? formatDate(selectedDate) : placeholder }}
        </button>
        
        <!-- Calendar Popup -->
        <div 
          v-if="isOpen" 
          class="absolute z-50 mt-1 w-auto p-0 bg-white border rounded-md shadow-lg"
          @click.stop
        >
          <Calendar
            :selected="selectedDate"
            @select="handleDateSelect"
            class="p-3"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps, defineEmits } from 'vue'
  import { CalendarIcon } from 'lucide-vue-next'
  import Calendar from './ui/Calendar.vue'
  
  interface Props {
    modelValue?: Date
    label: string
    placeholder?: string
  }
  
  const props = withDefaults(defineProps<Props>(), {
    placeholder: 'Sélectionner une date'
  })
  
  const emit = defineEmits<{
    'update:modelValue': [value: Date | undefined]
  }>()
  
  const isOpen = ref(false)
  const selectedDate = ref<Date | undefined>(props.modelValue)
  
  const toggleCalendar = () => {
    isOpen.value = !isOpen.value
  }
  
  const handleDateSelect = (date: Date) => {
    selectedDate.value = date
    emit('update:modelValue', date)
    isOpen.value = false
  }
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  }
  
  // Close calendar when clicking outside
  const handleClickOutside = (event: Event) => {
    if (isOpen.value) {
      isOpen.value = false
    }
  }
  
  // Add click outside listener
  document.addEventListener('click', handleClickOutside)
  </script>
  