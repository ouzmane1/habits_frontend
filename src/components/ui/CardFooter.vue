<template>
  <div :class="['flex items-center p-6 pt-0', customClass]">
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
