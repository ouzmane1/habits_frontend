<script setup>
import { inject, ref, onMounted } from 'vue'

const toggle = inject('popoverToggle')
const referenceRef = ref(null)

onMounted(() => {
  // Tu peux exposer referenceRef ici si besoin
})
</script>

<template>
  <button
    ref="referenceRef"
    @click="toggle"
    class="px-4 py-2 bg-gray-200 rounded"
  >
    <slot />
  </button>
</template>
