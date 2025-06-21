<template>
  <span
    :class="[
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      variant === 'outline' ? 'border border-gray-200 bg-white' : 'bg-amber-100 text-amber-700'
    ]"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'outline' | 'default'
}>()
</script>
  