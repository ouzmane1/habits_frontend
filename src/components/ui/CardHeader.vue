<template>
    <div class="flex flex-col space-y-1.5 p-6" :class="customClass">
      <slot />
    </div>
</template>
  
<script setup lang="ts">
  defineProps<{ customClass?: string }>()
</script>