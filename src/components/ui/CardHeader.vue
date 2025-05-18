<template>
  <div :class="['flex flex-col space-y-1.5 p-6', customClass]">
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
