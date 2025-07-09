<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div class="max-w-6xl mx-auto px-4 py-8">
        
        <!-- En-tête du profil -->
        <div class="rounded-lg  bg-card text-card-foreground shadow-xl mb-8">
          <div class="p-8">
            <div class="flex flex-col md:flex-row items-center gap-6">
              <div class="relative">
                <Avatar
                  :src="user.avatar" 
                  :alt="user.name" 
                  class="h-24 w-24"
                  fallback-class="bg-gradient-to-br from-emerald-400 to-blue-500 text-white text-2xl font-bold"
                >
                  {{ getInitials(user.name) }}
                </Avatar>

              </div>
              
              <div class="flex-1 text-center md:text-left">
                <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ user.name }}</h1>
                <p class="text-gray-600 mb-4">{{ user.email }}</p>
                <div class="flex flex-wrap gap-2 justify-center md:justify-start">
                  <div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700">
                    {{ completedHabits }} habitudes complétées
                  </div>
                  <div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700">
                    {{ badgesCount }} badges débloqués
                  </div>
                </div>
              </div>
              
              <div class="flex gap-2">
                <button @click="showEditDialog = true" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                  <Edit :size="16" />
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </div>
  
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Colonne principale -->
          <div class="lg:col-span-2 space-y-8">
            
            <!-- Statistiques -->
            <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div class="flex flex-col space-y-1.5 p-6">
                <h3 class="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
                  <TrendingUp class="text-emerald-600" :size="24" />
                  Statistiques
                </h3>
              </div>
              <div class="p-6 pt-0">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div class="text-center p-4 bg-gray-50 rounded-lg">
                    <Target class="mx-auto mb-2 text-emerald-600" :size="32" />
                    <div class="text-2xl font-bold text-gray-800">{{ completedHabits }}</div>
                    <div class="text-sm text-gray-600">Habitudes complétées</div>
                  </div>
                  <div class="text-center p-4 bg-gray-50 rounded-lg">
                    <Trophy class="mx-auto mb-2 text-amber-600" :size="32" />
                    <div class="text-2xl font-bold text-gray-800">{{ badgesCount }}</div>
                    <div class="text-sm text-gray-600">Badges débloqués</div>
                  </div>
                </div>
              </div>
            </div>
  
          </div>
  
          <!-- Colonne latérale - Badges récents -->
          <div class="space-y-6">
            <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div class="flex flex-col space-y-1.5 p-6">
                <h3 class="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
                  <Trophy class="text-amber-500" :size="24" />
                  Badges Récents
                </h3>
              </div>
              <div class="p-6 pt-0">
                <div class="space-y-4">
                  <div 
                    v-for="badge in unlockedBadges.slice(-3).reverse()" 
                    :key="badge.id" 
                    class="flex items-start gap-3 p-3 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border-l-4 border-emerald-500"
                  >
                    <div class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <font-awesome-icon :icon="badge.icon.split(' ')" class="text-white text-2xl" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <h4 class="font-semibold text-gray-800 text-sm">{{ badge.title }}</h4>
                      <p class="text-xs text-gray-600 mb-2">{{ badge.description }}</p>

                    </div>
                  </div>
                </div>
                
                <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-full mt-4">
                  <Trophy :size="16" />
                  Voir tous les badges
                </button>
              </div>
            </div>
  

          </div>
        </div>
      </div>
    </div>
    <EditUserDialog :open="showEditDialog" :user="user.value || { name: '', email: '' }" @update:open="showEditDialog = $event" @updated="handleUserUpdate" />
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { 
    Edit, 
    Settings, 
    TrendingUp, 
    Trophy, 
    Calendar,
    Target,
    Flame,
    Star,
    Award
  } from 'lucide-vue-next'
  import Avatar from '../components/ui/Avatar.vue'
  import AuthService from '@/services/auth.service'
  import BadgeService from '@/services/badge.service.js'
  import EditUserDialog from '@/components/EditUserDialog.vue'
  
  const user = ref({ name: '', email: '', completedHabits: 0 })
  const badges = ref([])
  const userBadges = ref([])
  const completedHabits = ref(0)
  const badgesCount = ref(0)
  const loading = ref(false)
  const showEditDialog = ref(false)
  
  const unlockedBadges = computed(() => {
    return badges.value.filter(badge =>
      userBadges.value.some(userBadge => userBadge.id === badge.id)
    )
  })
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('')
  }
  
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Commun': return 'bg-gray-100 text-gray-700'
      case 'Rare': return 'bg-blue-100 text-blue-700'
      case 'Épique': return 'bg-purple-100 text-purple-700'
      case 'Légendaire': return 'bg-amber-100 text-amber-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }
  
  const getStatIcon = (iconName: string) => {
    const icons = {
      Target,
      Flame,
      Trophy,
      Star
    }
    return icons[iconName as keyof typeof icons] || Target
  }
  
  const getBadgeIcon = (iconName: string) => {
    const icons = {
      Flame,
      Target,
      Award
    }
    return icons[iconName as keyof typeof icons] || Award
  }
  

  
  const handleUserUpdate = (updated) => {
    user.value = { ...user.value, name: updated.name, email: updated.email }
    // Mets à jour le localStorage si besoin
    const userLS = JSON.parse(localStorage.getItem('user') || '{}')
    userLS.name = updated.name
    userLS.email = updated.email
    localStorage.setItem('user', JSON.stringify(userLS))
  }
  
  onMounted(async () => {
    try {
      const userInfo = await AuthService.getUserInfo()
      user.value.name = userInfo.name
      user.value.email = userInfo.email
      completedHabits.value = userInfo.completedHabits || 0
      // Récupère les badges
      loading.value = true
      const [allBadges, userBadgesData] = await Promise.all([
        BadgeService.getAllBadges(),
        BadgeService.getUserBadges()
      ])
      badges.value = allBadges
      userBadges.value = userBadgesData
      badgesCount.value = unlockedBadges.value.length
      loading.value = false
    } catch (error) {
      loading.value = false
      console.error('Erreur lors de la récupération du profil ou des badges :', error)
    }
  })
  </script>