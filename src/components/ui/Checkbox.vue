<template>
  <input
    type="checkbox"
    :checked="modelValue"
    @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    :class="[
      'h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-400',
      className
    ]"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  class?: string
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const className = defineModel('class')
</script>
  