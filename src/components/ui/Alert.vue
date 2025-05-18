<template>
  <div
    role="alert"
    :class="[
      'relative w-full rounded-lg border p-4',
      variant === 'destructive'
        ? 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive'
        : 'bg-background text-foreground',
      customClass
    ]"
  >
    <slot />
  </div>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'default',
  },
  customClass: {
    type: [String, Array, Object],
    default: '',
  },
})
</script>
