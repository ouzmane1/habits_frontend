<template>
  <div :class="['rounded-lg border bg-card text-card-foreground shadow-sm', customClass]">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  customClass: {
    type: [String, Array, Object],
    default: '',
  },
})
</script>
