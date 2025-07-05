<template>
    <div class="relative inline-block text-left">
      <div>
        <button
          ref="trigger"
          @click="toggleDropdown"
          class="inline-flex w-full justify-center items-center"
          :class="triggerClass"
        >
          <slot name="trigger"></slot>
        </button>
      </div>
  
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="isOpen"
          class="absolute z-50 mt-2 w-48 rounded-md border bg-popover shadow-md"
          :class="alignClass"
        >
          <div class="p-1">
            <slot name="content"></slot>
          </div>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  
  interface Props {
    align?: 'start' | 'end'
    triggerClass?: string
  }
  
  const props = withDefaults(defineProps<Props>(), {
    align: 'start',
    triggerClass: ''
  })
  
  const isOpen = ref(false)
  const trigger = ref(null)
  
  const alignClass = computed(() => {
    return props.align === 'end' ? 'right-0' : 'left-0'
  })
  
  const toggleDropdown = () => {
    isOpen.value = !isOpen.value
  }
  
  const closeDropdown = (event: Event) => {
    if (trigger.value && !trigger.value.contains(event.target)) {
      isOpen.value = false
    }
  }
  
  onMounted(() => {
    document.addEventListener('click', closeDropdown)
  })
  
  onUnmounted(() => {
    document.removeEventListener('click', closeDropdown)
  })
  </script>