<template>
  <div class="pt-6 pb-2 px-6">
    <button @click="goBack" class="flex items-center gap-2 px-4 py-2 bg-white border rounded hover:bg-gray-50 font-medium text-gray-700">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      Retour aux défis
    </button>
  </div>
  <div class="max-w-4xl mx-auto space-y-6">
      
    <!-- En-tête du défi -->
    <div v-if="challenge" class="border-1 rounded-lg border bg-card text-card-foreground shadow-sm">
      <div class="flex flex-col space-y-1.5 p-6 pb-4">
        <div class="flex items-start justify-between mb-4">
          <div class="flex gap-3">
            <span :class="getCategoryColor(challenge.category)" class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
              {{ challenge.category }}
            </span>
            <span :class="getDifficultyColor(challenge.difficulty)" class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
              {{ challenge.difficulty }}
            </span>
            <span v-if="challenge.isActive" class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-blue-100 text-blue-700 border-blue-200">
              En cours
            </span>
          </div>
          
          <div class="text-right">
            <div class="flex items-center gap-2 text-lg font-bold text-emerald-600">
              <Trophy class="h-5 w-5" />
              {{ challenge.total_points }} pts
            </div>
          </div>
        </div>

        <h1 class="text-2xl font-bold text-gray-800 mb-3">
          {{ challenge.title }}
        </h1>
        
        <p class="text-gray-600 text-base leading-relaxed">
          {{ challenge.description }}
        </p>
      </div>

      <div class="p-6 pt-0">
        <!-- Progression si actif -->
        <div v-if="challenge.isActive" class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div class="flex justify-between items-center mb-3">
            <span class="font-medium text-blue-800">Votre progression</span>
            <span class="text-xl font-bold text-blue-600">{{ formatProgress(userProgress ? userProgress.progress : 0) }}%</span>
          </div>
          <div class="w-full bg-blue-200 rounded-full h-3">
            <div 
              class="bg-blue-600 h-3 rounded-full transition-all duration-300"
              :style="{ width: `${Math.min(100, Math.max(0, formatProgress(userProgress ? userProgress.progress : 0)))}%` }"
            ></div>
          </div>
          <div class="flex justify-between mt-3 text-sm text-blue-700">
            <span>Votre classement: #{{ userStats.rank }}</span>
            <span>Vos points: {{ userStats.points }}</span>
          </div>
        </div>

        <!-- Informations détaillées -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Calendar class="h-5 w-5 text-gray-600" />
            <div>
              <div class="text-xs text-gray-500">Début</div>
              <div class="font-medium">{{ formatDate(challenge.date_start) }}</div>
            </div>
          </div>
          
          <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Timer class="h-5 w-5 text-gray-600" />
            <div>
              <div class="text-xs text-gray-500">Fin</div>
              <div class="font-medium">{{ formatDate(challenge.date_end) }}</div>
            </div>
          </div>
          
          <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Users class="h-5 w-5 text-gray-600" />
            <div>
              <div class="text-xs text-gray-500">Participants</div>
              <div class="font-medium">{{ challenge.participants ? challenge.participants.toLocaleString() : '0' }}</div>
            </div>
          </div>
          
          <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Target class="h-5 w-5 text-gray-600" />
            <div>
              <div class="text-xs text-gray-500">Points totaux</div>
              <div class="font-medium">{{ challenge.total_points ? challenge.total_points.toLocaleString() : '0' }}</div>
            </div>
          </div>
        </div>

        <!-- Boutons d'action -->
        <div class="flex gap-3">
          <button 
            v-if="challenge.isActive"
            @click="leaveDefi"
            class="flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 py-2 border border-red-200 text-red-700 hover:bg-red-50"
          >
            Quitter le défi
          </button>
          <button 
            v-else
            @click="joinDefi"
            class="flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Rejoindre le défi
          </button>
          <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 px-6 h-10 border border-input bg-background hover:bg-accent hover:text-accent-foreground">
            Partager
          </button>
        </div>
      </div>
    </div>

    <!-- Etat de chargement -->
    <div v-else-if="loading" class="flex justify-center items-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Chargement du défi...</p>
      </div>
    </div>

    <!-- Etat d'erreur -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-600 mb-4">
        <p class="text-lg font-medium">{{ error }}</p>
      </div>
      <button @click="loadDefi" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
        Réessayer
      </button>
    </div>

    <!-- Classement des utilisateurs -->
    <div v-if="challenge && leaderboard.length > 0" class="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div class="flex flex-col space-y-1.5 p-6">
        <h2 class="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
          <TrendingUp class="h-5 w-5" />
          Classement des participants
        </h2>
      </div>
      <div class="p-6 pt-0">
        <div class="space-y-3">
          <div v-for="user in leaderboard" :key="user.position">
            <div class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center gap-4">
                <div class="flex items-center justify-center w-8 h-8">
                  <Crown v-if="user.rank === 1" class="h-5 w-5 text-yellow-500" />
                  <Medal v-else-if="user.rank === 2" class="h-5 w-5 text-gray-400" />
                  <Medal v-else-if="user.rank === 3" class="h-5 w-5 text-amber-600" />
                  <span v-else class="text-sm font-bold text-gray-600">#{{ user.position }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {{ user.username.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <div class="font-medium text-gray-800">{{ user.username }}</div>
                    <div class="text-sm text-gray-500">Participant #{{ user.position }}</div>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="flex items-center gap-1">
                  <Star class="h-4 w-4 text-yellow-500" />
                  <span class="font-bold text-gray-800">{{ user.point}}</span>
                </div>
                <div class="text-sm text-gray-500">points</div>
              </div>
            </div>
            <div v-if="user.position < leaderboard.length" class="border-t"></div>
          </div>
        </div>
        
        <div v-if="leaderboard.length > 5" class="mt-4 text-center">
          <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-9 px-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground">
            Voir plus de participants
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Calendar, 
  Users, 
  Trophy, 
  Timer, 
  Target,
  Medal,
  Crown,
  Star,
  TrendingUp
} from 'lucide-vue-next'
import DefiService from '@/services/defi.service.js'

const route = useRoute()
const router = useRouter()

const challenge = ref(null)
const leaderboard = ref([])
const userProgress = ref(null)
const userStats = ref(null)
const loading = ref(true)
const error = ref('')

const loadDefi = async () => {
  try {
    loading.value = true
    error.value = ''
    const defiId = route.params.id
    const defiData = await DefiService.getDefi(defiId)
    challenge.value = defiData

    // Classement dynamique
    const classement = await DefiService.getClassement(defiId)
    leaderboard.value = classement
    console.log('Classement:', classement)

    // Progression utilisateur
    userProgress.value = await DefiService.getProgress(defiId)
    // Stats utilisateur (rang, points, etc)
    userStats.value = await DefiService.getStats(defiId)
    console.log('Stats utilisateur:', userStats.value)
  } catch (err) {
    console.error('Erreur lors du chargement du défi:', err)
    error.value = 'Erreur lors du chargement du défi'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'Non défini'
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const formatProgress = (progress) => {
  if (!progress) return 0
  // Convertir en nombre si c'est une chaîne
  const numProgress = parseFloat(progress)
  // S'assurer que c'est un nombre valide et le limiter entre 0 et 100
  return Math.min(100, Math.max(0, isNaN(numProgress) ? 0 : numProgress))
}

const joinDefi = async () => {
  try {
    await DefiService.joinDefi(challenge.value.id)
    await loadDefi()
  } catch (err) {
    if (err.response && err.response.data) {
      console.error('Erreur API:', err.response.data)
    }
    alert('Erreur lors de la participation au défi.')
  }
}

const leaveDefi = async () => {
  try {
    await DefiService.leaveDefi(challenge.value.id)
    console.log('Quitter le défi : ', challenge.value.title)
    await loadDefi()
  } catch (err) {
    if (err.response && err.response.data) {
      console.error('Erreur API:', err.response.data)
    }
    alert('Erreur lors du quit du défi.')
  }
}

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'Facile': return 'bg-green-100 text-green-700 border-green-200'
    case 'Moyen': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    case 'Difficile': return 'bg-red-100 text-red-700 border-red-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

const getCategoryColor = (category) => {
  switch (category) {
    case 'Sante': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    case 'Productivite': return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'Bien-etre': return 'bg-purple-100 text-purple-700 border-purple-200'
    case 'Nutrition': return 'bg-orange-100 text-orange-700 border-orange-200'
    case 'Developpement': return 'bg-indigo-100 text-indigo-700 border-indigo-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

const goBack = () => router.back()

onMounted(() => {
  loadDefi()
})
</script>