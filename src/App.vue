<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import Navbar from '@/components/NavBar.vue'

const route = useRoute()
const isAuthPage = computed(() => route.name === 'auth')
</script>

<template>
  <Navbar v-if="!isAuthPage"/>
  <RouterView />
</template>