<template>
    <input
      :type="type"
      :class="mergedClass"
      v-bind="$attrs"
      ref="inputRef"
    />
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  const props = defineProps({
    type: {
      type: String,
      default: 'text',
    },
    class: {
      type: String,
      default: '',
    },
  })
  
  const inputRef = ref(null)
  
  const mergedClass = computed(() =>
    [
      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
      'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
      'placeholder:text-muted-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
      props.class,
    ].join(' ')
  )
  </script>
  