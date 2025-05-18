<template>
  <h3 :class="['text-2xl font-semibold leading-none tracking-tight', customClass]">
    <slot />
  </h3>
</template>

<script setup>
defineProps({
  customClass: {
    type: [String, Array, Object],
    default: '',
  },
})
</script>
