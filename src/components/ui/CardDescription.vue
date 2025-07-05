<template>
    <p class="text-sm text-muted-foreground" :class="customClass">
      <slot />
    </p>
  </template>
  
  <script setup lang="ts">
  defineProps<{ customClass?: string }>()
  </script>