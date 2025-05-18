<template>
  <div :class="['p-6 pt-0', customClass]">
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
