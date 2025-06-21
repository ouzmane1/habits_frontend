<template>
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm" :class="customClass">
      <slot />
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{ customClass?: string }>()
  </script>