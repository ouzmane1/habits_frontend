<template>
    <div class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full" :class="className">
      <img
        v-if="src"
        :src="src"
        :alt="alt"
        class="aspect-square h-full w-full"
      />
      <div
        v-else
        class="flex h-full w-full items-center justify-center rounded-full bg-muted"
        :class="fallbackClass"
      >
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Props {
    src?: string
    alt?: string
    className?: string
    fallbackClass?: string
  }
  
  withDefaults(defineProps<Props>(), {
    src: '',
    alt: 'Avatar',
    className: '',
    fallbackClass: ''
  })
  </script>