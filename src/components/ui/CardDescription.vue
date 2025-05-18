<template>
  <p :class="['text-sm text-muted-foreground', customClass]">
    <slot />
  </p>
</template>

<script setup>
defineProps({
  customClass: {
    type: [String, Array, Object],
    default: '',
  },
})
</script>
