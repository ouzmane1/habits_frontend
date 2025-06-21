<template>
    <div class="p-3">
      <div class="flex justify-center pt-1 relative items-center mb-4">
        <button
          type="button"
          @click="previousMonth"
          class="absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border rounded-md flex items-center justify-center"
        >
          <ChevronLeft class="h-4 w-4" />
        </button>
        
        <div class="text-sm font-medium">
          {{ currentMonthYear }}
        </div>
        
        <button
          type="button"
          @click="nextMonth"
          class="absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border rounded-md flex items-center justify-center"
        >
          <ChevronRight class="h-4 w-4" />
        </button>
      </div>
  
      <div class="w-full border-collapse space-y-1">
        <!-- Days of week header -->
        <div class="flex">
          <div 
            v-for="day in daysOfWeek" 
            :key="day"
            class="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center"
          >
            {{ day }}
          </div>
        </div>
  
        <!-- Calendar grid -->
        <div class="flex flex-col mt-2">
          <div 
            v-for="week in calendarWeeks" 
            :key="week[0]?.getTime() || 0"
            class="flex w-full"
          >
            <button
              v-for="day in week"
              :key="day?.getTime() || 0"
              type="button"
              @click="selectDate(day)"
              :class="getDayClasses(day)"
              class="h-9 w-9 p-0 font-normal text-sm relative focus-within:relative focus-within:z-20"
            >
              {{ day ? day.getDate() : '' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, defineProps, defineEmits } from 'vue'
  import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
  
  interface Props {
    selected?: Date
  }
  
  const props = defineProps<Props>()
  
  const emit = defineEmits<{
    select: [date: Date]
  }>()
  
  const currentDate = ref(new Date())
  const currentMonth = ref(new Date().getMonth())
  const currentYear = ref(new Date().getFullYear())
  
  const daysOfWeek = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di']
  
  const currentMonthYear = computed(() => {
    const date = new Date(currentYear.value, currentMonth.value)
    return new Intl.DateTimeFormat('fr-FR', {
      month: 'long',
      year: 'numeric'
    }).format(date)
  })
  
  const calendarWeeks = computed(() => {
    const firstDay = new Date(currentYear.value, currentMonth.value, 1)
    const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
    
    // Get first Monday of the calendar view
    const startDate = new Date(firstDay)
    const dayOfWeek = firstDay.getDay()
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    startDate.setDate(firstDay.getDate() - daysToSubtract)
    
    const weeks: (Date | null)[][] = []
    const currentWeekDate = new Date(startDate)
    
    for (let week = 0; week < 6; week++) {
      const weekDays: (Date | null)[] = []
      
      for (let day = 0; day < 7; day++) {
        const date = new Date(currentWeekDate)
        weekDays.push(date)
        currentWeekDate.setDate(currentWeekDate.getDate() + 1)
      }
      
      weeks.push(weekDays)
      
      // Stop if we've covered the whole month and reached next month
      if (currentWeekDate.getMonth() !== currentMonth.value && week >= 3) {
        break
      }
    }
    
    return weeks
  })
  
  const selectDate = (date: Date | null) => {
    if (date) {
      emit('select', date)
    }
  }
  
  const previousMonth = () => {
    if (currentMonth.value === 0) {
      currentMonth.value = 11
      currentYear.value--
    } else {
      currentMonth.value--
    }
  }
  
  const nextMonth = () => {
    if (currentMonth.value === 11) {
      currentMonth.value = 0
      currentYear.value++
    } else {
      currentMonth.value++
    }
  }
  
  const getDayClasses = (day: Date | null) => {
    if (!day) return 'invisible'
    
    const today = new Date()
    const isToday = day.toDateString() === today.toDateString()
    const isSelected = props.selected && day.toDateString() === props.selected.toDateString()
    const isCurrentMonth = day.getMonth() === currentMonth.value
    
    let classes = 'hover:bg-accent hover:text-accent-foreground rounded-md transition-colors'
    
    if (isSelected) {
      classes += ' bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
    } else if (isToday) {
      classes += ' bg-accent text-accent-foreground'
    }
    
    if (!isCurrentMonth) {
      classes += ' text-muted-foreground opacity-50'
    }
    
    return classes
  }
  </script>