<template>
  <button
    :class="[
      'inline-flex items-center justify-center rounded-md font-medium transition-colors',
      size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2',
      props.class
    ]"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  size?: 'sm' | 'default'
  class?: string
}>()
</script> 