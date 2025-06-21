<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-8">
        <WelcomeSlider
          userName=""
          :showChallengeButton="true"
          :onChallengeClick="handleChallengeClick"
        />
      </div>

      
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import WelcomeSlider from '@/components/WelcomeSlider.vue'

const router = useRouter()

const handleChallengeClick = () => {
  router.push('/defis')
}
</script>
