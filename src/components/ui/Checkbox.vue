<template>
  <label class="inline-flex items-center space-x-2">
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
      :class="[
        'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'checked:bg-primary checked:text-primary-foreground',
        customClass,
      ]"
    />
    <slot />
  </label>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  customClass: {
    type: [String, Array, Object],
    default: '',
  },
})

defineEmits(['update:modelValue'])
</script>
