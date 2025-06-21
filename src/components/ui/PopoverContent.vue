<script setup>
import { inject, ref, watch } from 'vue'
import { useFloating, offset, shift, autoPlacement } from '@floating-ui/vue'

const open = inject('popoverOpen')
const close = inject('popoverClose')

const referenceRef = ref(null)
const contentRef = ref(null)

const { floatingStyles, update } = useFloating(referenceRef, contentRef, {
  placement: 'bottom',
  middleware: [offset(4), shift(), autoPlacement()],
})

watch(open, (val) => {
  if (val) update()
})
</script>

<template>
  <transition name="popover-transition">
    <div
      v-if="open"
      ref="contentRef"
      :style="floatingStyles"
      class="z-50 w-72 rounded-md border bg-white p-4 shadow-md outline-none"
    >
      <slot />
    </div>
  </transition>
</template>

<style scoped>
.popover-transition-enter-active,
.popover-transition-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.popover-transition-enter-from,
.popover-transition-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
