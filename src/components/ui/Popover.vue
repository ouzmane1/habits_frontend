<script setup>
import { ref, provide } from 'vue'

const open = ref(false)
const toggle = () => (open.value = !open.value)
const close = () => (open.value = false)

provide('popoverToggle', toggle)
provide('popoverOpen', open)
provide('popoverClose', close)
</script>

<template>
  <div class="relative inline-block">
    <slot />
  </div>
</template>
