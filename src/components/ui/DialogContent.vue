<template>
    <div
      class="fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg"
    >
      <slot />
      <button
        class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        @click="$emit('close')"
      >
        <X class="h-4 w-4" />
        <span class="sr-only">Fermer</span>
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { X } from 'lucide-vue-next'
  
  defineEmits(['close'])
  </script>
  