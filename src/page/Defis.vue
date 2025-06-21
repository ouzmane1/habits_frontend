<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-4">Defis disponibles</h1>
        <p class="text-gray-600 text-lg">
          Relevez des defis pour booster votre motivation et gagner des points !
        </p>
      </div>

      <!-- Etat de chargement -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Chargement des defis...</p>
        </div>
      </div>

      <!-- Etat d'erreur -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-600 mb-4">
          <p class="text-lg font-medium">{{ error }}</p>
        </div>
        <Button @click="loadDefis" class="bg-blue-600 hover:bg-blue-700">
          Reessayer
        </Button>
      </div>

      <!-- Liste des defis -->
      <div v-else-if="challenges.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          v-for="challenge in challenges"
          :key="challenge.id"
          class="p-6 hover:shadow-lg transition-all duration-200"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex gap-2">
              <Badge :class="getCategoryColor(challenge.category)">
                {{ challenge.category }}
              </Badge>
              <Badge variant="outline" :class="getDifficultyColor(challenge.difficulty)">
                {{ challenge.difficulty }}
              </Badge>
            </div>

            <Badge v-if="challenge.isActive" class="bg-blue-100 text-blue-700">
              En cours
            </Badge>

            <Badge v-if="challenge.progress === 100" class="bg-green-100 text-green-700">
              Termine ✓
            </Badge>
          </div>

          <h3 class="text-xl font-semibold text-gray-800 mb-3">
            {{ challenge.title }}
          </h3>

          <p class="text-gray-600 mb-4">
            {{ challenge.description }}
          </p>

          <div v-if="challenge.isActive" class="mb-4">
            <div class="flex justify-between text-sm mb-2">
              <span class="text-gray-600">Progression</span>
              <span class="font-medium text-blue-600">{{ challenge.progress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: challenge.progress + '%' }"
              ></div>
            </div>
          </div>

          <div class="space-y-3 mb-6">
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <Timer :size="16" />
              <span>{{ challenge.duration }}</span>
            </div>

            <div class="flex items-center gap-2 text-sm text-gray-600">
              <Users :size="16" />
              <span>{{ challenge.participants }} participants</span>
            </div>

            <div class="flex items-center gap-2 text-sm text-gray-600">
              <Trophy :size="16" />
              <span>{{ challenge.reward }} points de recompense</span>
            </div>
          </div>

          <Button
            class="w-full"
            :class="[
              challenge.isActive
                ? 'bg-blue-600 hover:bg-blue-700'
                : challenge.progress === 100
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            ]"
            :disabled="challenge.progress === 100"
          >
            {{
              challenge.isActive
                ? 'Continuer le defi'
                : challenge.progress === 100
                ? 'Defi termine'
                : 'Commencer le defi'
            }}
          </Button>
        </Card>
      </div>

      <!-- Etat vide -->
      <div v-else class="text-center py-12">
        <div class="text-gray-500">
          <Trophy class="mx-auto mb-4 text-gray-300" :size="64" />
          <h3 class="text-xl font-medium mb-2">Aucun defi disponible</h3>
          <p class="text-gray-600">Revenez plus tard pour decouvrir de nouveaux defis !</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import { Users, Trophy, Timer } from 'lucide-vue-next'
import DefiService from '@/services/defi.service.js'

const challenges = ref([])
const loading = ref(true)
const error = ref('')

const loadDefis = async () => {
  try {
    console.log('Chargement des defis...')
    loading.value = true
    error.value = ''
    const defisData = await DefiService.getDefis()
    console.log('Defis recus:', defisData)
    challenges.value = defisData || []
  } catch (err) {
    console.error('Erreur lors du chargement des defis:', err)
    error.value = 'Erreur lors du chargement des defis'
    challenges.value = []
  } finally {
    loading.value = false
  }
}

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'Facile': return 'bg-green-100 text-green-700'
    case 'Moyen': return 'bg-yellow-100 text-yellow-700'
    case 'Difficile': return 'bg-red-100 text-red-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const getCategoryColor = (category) => {
  switch (category) {
    case 'Sante': return 'bg-emerald-100 text-emerald-700'
    case 'Productivite': return 'bg-blue-100 text-blue-700'
    case 'Bien-etre': return 'bg-purple-100 text-purple-700'
    case 'Nutrition': return 'bg-orange-100 text-orange-700'
    case 'Developpement': return 'bg-indigo-100 text-indigo-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

onMounted(() => {
  console.log('Page Defis montee')
  loadDefis()
})
</script> 