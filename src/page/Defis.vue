<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center items-center mb-8">
        <div>
          <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">Défis disponibles</h1>
          <p class="text-gray-600 text-base sm:text-lg">
            Relevez des défis pour booster votre motivation et gagner des points !
          </p>
        </div>
        <Button
          v-if="isAdmin"
          @click="isAddDefiDialogOpen = true" class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base w-full sm:w-auto mt-4 sm:mt-0 text-center">
          Créer un défi
        </Button>
      </div>
      
      <AddDefiDialog :open="isAddDefiDialogOpen" @update:open="isAddDefiDialogOpen = $event" @created="handleDefiCreated"/>

      <EditDefiDialog 
        :open="isEditDialogOpen" 
        :defiToEdit="defiToEdit" 
        @update:open="isEditDialogOpen = $event" 
        @updated="handleDefiUpdated"
      />

      <ConfirmDialog 
        :open="isConfirmDialogOpen" 
        :itemToDelete="defiToDelete" 
        @update:open="isConfirmDialogOpen = $event" 
        @deleted="handleDefiDeleted"
      />

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
          class="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
          @click="viewDefiDetail(challenge)"
        >
          <div class="flex items-start justify-between mb-4">

            <div class="flex items-center gap-2" @click.stop>
                <button v-if="isAdmin" @click="editDefi(challenge)" class="text-blue-500 hover:text-blue-700">
                    <Pencil size="18" />
                </button>
                <button v-if="isAdmin" @click="deleteDefi(challenge)" class="text-red-500 hover:text-red-700">
                    <Trash size="18" />
                </button>
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
              <span class="font-medium text-blue-600">{{ formatProgress(challenge.progress) }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${Math.min(100, Math.max(0, formatProgress(challenge.progress)))}%` }"
              ></div>
            </div>
          </div>

          <div class="space-y-3 mb-6">
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <Timer :size="16" />
              <span>{{ challenge.days_remaining }} jours</span>
            </div>

            <div class="flex items-center gap-2 text-sm text-gray-600">
              <Users :size="16" />
              <span>{{ challenge.participants }} participants</span>
            </div>

            <div class="flex items-center gap-2 text-sm text-gray-600">
              <Trophy :size="16" />
              <span>{{ challenge.total_points }} points de recompense</span>
            </div>
          </div>

          <Button
            class="w-full text-white"
            :class="[
              challenge.isActive
                ? 'bg-blue-600 hover:bg-blue-700'
                : challenge.progress === 100
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            ]"
            :disabled="challenge.progress === 100"
            @click.stop="handleJoinDefi(challenge)"
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
import { useRouter } from 'vue-router'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import { Users, Trophy, Timer, Pencil, Trash } from 'lucide-vue-next'
import DefiService from '@/services/defi.service.js'
import AddDefiDialog from '@/components/AddDefiDialog.vue'
import EditDefiDialog from '@/components/EditDefiDialog.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const router = useRouter()
const challenges = ref([])
const loading = ref(true)
const error = ref('')
const isAddDefiDialogOpen = ref(false)

const isEditDialogOpen = ref(false)
const defiToEdit = ref(null)

const isConfirmDialogOpen = ref(false)
const defiToDelete = ref(null)

// Récupération du rôle admin (robuste)
const user = JSON.parse(localStorage.getItem('user') || '{}')
const roles = Array.isArray(user.role) ? user.role : (typeof user.role === 'string' ? [user.role] : [])
const isAdmin = roles.includes('ROLE_ADMIN')

const loadDefis = async () => {
  try {
    console.log('Chargement des defis...')
    loading.value = true
    error.value = ''
    const defisData = await DefiService.getDefis()
    console.log('Defis recus:', defisData)
    
    // Récupérer la progression pour chaque défi actif
    const defisWithProgress = await Promise.all(
      defisData.map(async (defi) => {
        if (defi.isActive) {
          try {
            const progressData = await DefiService.getProgress(defi.id)
            return {
              ...defi,
              progress: progressData.progress || 0
            }
          } catch (error) {
            console.error(`Erreur lors de la récupération de la progression pour le défi ${defi.id}:`, error)
            return {
              ...defi,
              progress: 0
            }
          }
        }
        return defi
      })
    )
    
    challenges.value = defisWithProgress || []
    console.log('defis avec progression:', challenges.value)
  } catch (err) {
    console.error('Erreur lors du chargement des defis:', err)
    error.value = 'Erreur lors du chargement des defis'
    challenges.value = []
  } finally {
    loading.value = false
  }
}

const handleDefiCreated = () => {
  isAddDefiDialogOpen.value = false
  loadDefis()
}

const editDefi = (challenge) => {
  defiToEdit.value = challenge
  isEditDialogOpen.value = true
}

const handleDefiUpdated = () => {
  isEditDialogOpen.value = false
  loadDefis()
}

const deleteDefi = (challenge) => {
  defiToDelete.value = {
    id: challenge.id,
    title: challenge.title,
    type: 'defi'
  }
  isConfirmDialogOpen.value = true
}

const handleDefiDeleted = () => {
  isConfirmDialogOpen.value = false
  loadDefis()
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

const viewDefiDetail = (challenge) => {
  router.push({
    name: 'DefisDetail',
    params: { id: challenge.id },
    state: { challenge: challenge }
  })
}

const handleJoinDefi = async (challenge) => {
  try {
    await DefiService.joinDefi(challenge.id)
    await loadDefis()
  } catch (err) {
    if (err.response && err.response.data) {
      console.error('Erreur API:', err.response.data)
    }
    alert('Erreur lors de la participation au défi.')
  }
}

const formatProgress = (progress) => {
  if (!progress) return 0
  // Convertir en nombre si c'est une chaîne
  const numProgress = parseFloat(progress)
  // S'assurer que c'est un nombre valide et le limiter entre 0 et 100
  return Math.min(100, Math.max(0, isNaN(numProgress) ? 0 : numProgress))
}

onMounted(() => {
  console.log('Page Defis montee')
  loadDefis()
})
</script> 