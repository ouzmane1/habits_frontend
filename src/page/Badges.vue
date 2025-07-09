<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="mb-8">
          <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">Collection de Badges</h1>
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <p class="text-gray-600 text-base sm:text-lg">
              Collectionnez des badges en accomplissant vos objectifs !
            </p>
            <div class="flex items-center gap-2">
              <Badge class="bg-emerald-100 text-emerald-700">
                {{ unlockedBadges.length }}/{{ badges.length }} débloqués
              </Badge>
            </div>
          </div>
        </div>
  
        <!-- Loading state -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p class="text-gray-600">Chargement des badges...</p>
        </div>
  
        <!-- Error state -->
        <div v-else-if="error" class="text-center py-12">
          <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <div class="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 class="text-lg font-semibold text-red-800 mb-2">Erreur</h3>
            <p class="text-red-600 mb-4">{{ error }}</p>
            <button @click="loadBadges" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
              Réessayer
            </button>
          </div>
        </div>
  
        <!-- Content when data is loaded -->
        <div v-else>
          <!-- Badges débloqués -->
          <div class="mb-12" v-if="unlockedBadges.length > 0">
            <h2 class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Trophy class="text-amber-500" size="28" />
              Badges Débloqués
            </h2>
    
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card v-for="badge in unlockedBadges" :key="badge.id" class="p-6 text-center hover:shadow-lg transition-all duration-200 border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-blue-50">
                <div class="mb-4">
                  <div class="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <font-awesome-icon :icon="badge.icon.split(' ')" class="text-white text-2xl" />
                  </div>
                </div>
    
                <h3 class="text-base sm:text-lg font-semibold text-gray-800 mb-2">{{ badge.title }}</h3>
                <p class="text-xs sm:text-sm text-gray-600 mb-4">{{ badge.description }}</p>
    
                
    
                <p class="text-xs text-emerald-600 font-medium">
                  Débloqué {{ formatDate(getUnlockedDate(badge.id)) }}
                </p>
              </Card>
            </div>
          </div>
    
          <!-- Badges à débloquer -->
          <div v-if="lockedBadges.length > 0">
            <h2 class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Target class="text-gray-500" size="28" />
              Badges à Débloquer
            </h2>
    
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card v-for="badge in lockedBadges" :key="badge.id" class="p-6 text-center hover:shadow-lg transition-all duration-200 opacity-75 hover:opacity-90">
                <div class="mb-4">
                  <div class="w-16 h-16 mx-auto bg-gray-300 rounded-full flex items-center justify-center">
                    <font-awesome-icon :icon="badge.icon.split(' ')" class="text-gray-500 text-2xl" />
                  </div>
                </div>
    
                <h3 class="text-base sm:text-lg font-semibold text-gray-600 mb-2">{{ badge.title }}</h3>
                <p class="text-xs sm:text-sm text-gray-500 mb-4">{{ badge.description }}</p>
    
              
    
                <p class="text-xs text-gray-400 font-medium">
                  🔒 À débloquer
                </p>
              </Card>
            </div>
          </div>

          <!-- Empty state -->
          <div v-if="badges.length === 0" class="text-center py-12">
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
              <div class="text-gray-400 text-4xl mb-4">📭</div>
              <h3 class="text-base sm:text-lg font-semibold text-gray-800 mb-2">Aucun badge disponible</h3>
              <p class="text-gray-600">Les badges apparaîtront ici une fois qu'ils seront créés.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import Card from '@/components/ui/Card.vue';
  import Badge from '@/components/ui/Badge.vue';
  import { Trophy, Star, Target, Flame, Calendar, Users } from 'lucide-vue-next';
  import BadgeService from '@/services/badge.service.js';
  
  const badges = ref([]);
  const userBadges = ref([]);
  const loading = ref(false);
  const error = ref(null);
  
  // Badges débloqués = intersection entre tous les badges et les badges de l'utilisateur
  const unlockedBadges = computed(() => {
    console.log('=== DEBUGGING BADGE COMPARISON ===');
    console.log('All badges:', JSON.stringify(badges.value, null, 2));
    console.log('User badges:', JSON.stringify(userBadges.value, null, 2));
    
    const unlocked = badges.value.filter(badge => {
      const isUnlocked = userBadges.value.some(userBadge => {
        console.log(`Comparing badge ${badge.id} (${badge.title}) with userBadge:`, userBadge);
        
        // Comparer par l'id
        const matchById = userBadge.id === badge.id;
        console.log(`Match by id: ${matchById} (${userBadge.id} === ${badge.id})`);
        
        return matchById;
      });
      return isUnlocked;
    });
    
    console.log('Unlocked badges result:', unlocked);
    return unlocked;
  });
  
  // Badges à débloquer = badges qui ne sont pas dans les badges de l'utilisateur
  const lockedBadges = computed(() => {
    const locked = badges.value.filter(badge => 
      !userBadges.value.some(userBadge => 
        userBadge.id === badge.id
      )
    );
    console.log('Locked badges result:', locked);
    return locked;
  });
  
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Commun': return 'bg-gray-100 text-gray-700';
      case 'Rare': return 'bg-blue-100 text-blue-700';
      case 'Épique': return 'bg-purple-100 text-purple-700';
      case 'Légendaire': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Débuts': return 'bg-green-100 text-green-700';
      case 'Persévérance': return 'bg-orange-100 text-orange-700';
      case 'Série': return 'bg-red-100 text-red-700';
      case 'Performance': return 'bg-indigo-100 text-indigo-700';
      case 'Social': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getBadgeIcon = (iconName) => {
    const iconMap = {
      'trophy': Trophy,
      'star': Star,
      'target': Target,
      'flame': Flame,
      'calendar': Calendar,
      'users': Users
    };
    return iconMap[iconName?.toLowerCase()] || Target;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getUnlockedDate = (badgeId) => {
    const userBadge = userBadges.value.find(ub => ub.id === badgeId);
    return userBadge?.unlockedDate || userBadge?.created_at || userBadge?.unlocked_at;
  };

  const loadBadges = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      // Charger tous les badges et les badges de l'utilisateur en parallèle
      const [allBadgesData, userBadgesData] = await Promise.all([
        BadgeService.getAllBadges(),
        BadgeService.getUserBadges()
      ]);
      
      badges.value = allBadgesData;
      userBadges.value = userBadgesData;
      
      // Afficher les badges de l'utilisateur dans la console
      console.log('Badges de l\'utilisateur:', userBadgesData);
      console.log('Tous les badges:', allBadgesData);
      
      // Debug: vérifier la logique de tri
      console.log('Badges débloqués (computed):', unlockedBadges.value);
      console.log('Badges à débloquer (computed):', lockedBadges.value);
    } catch (err) {
      error.value = err.message;
      console.error('Erreur lors du chargement des badges:', err);
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    loadBadges();
  });
  </script>
  