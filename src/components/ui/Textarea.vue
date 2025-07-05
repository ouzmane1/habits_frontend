<template>
    <textarea
      ref="textareaRef"
      :class="mergedClass"
      v-bind="$attrs"
    />
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  const props = defineProps({
    class: {
      type: String,
      default: '',
    }
  })
  
  const textareaRef = ref(null)
  
  const baseClasses = "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  
  const mergedClass = computed(() => [baseClasses, props.class].join(' '))
  </script>
  