<template>
    <div class="flex items-center p-6 pt-0" :class="customClass">
      <slot />
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{ customClass?: string }>()
  </script>
  