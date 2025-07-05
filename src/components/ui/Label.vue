<template>
    <label
      :for="htmlFor"
      :class="mergedClass"
      v-bind="$attrs"
      ref="labelRef"
    >
      <slot />
    </label>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  const props = defineProps({
    htmlFor: String,
    class: {
      type: String,
      default: '',
    },
  })
  
  const labelRef = ref(null)
  
  const baseClasses = "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  
  const mergedClass = computed(() => [baseClasses, props.class].join(' '))
  </script>
  