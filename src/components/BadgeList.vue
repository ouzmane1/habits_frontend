<template>
  <div class="badge-list-container">
    <div class="badge-header">
      <h2>🏆 Badges Disponibles</h2>
      <p>Découvrez tous les badges que vous pouvez débloquer</p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Chargement des badges...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <h3>Erreur</h3>
      <p>{{ error }}</p>
      <button @click="loadBadges" class="retry-button">
        Réessayer
      </button>
    </div>

    <!-- Badges grid -->
    <div v-else class="badges-grid">
      <div 
        v-for="badge in badges" 
        :key="badge.id" 
        class="badge-card"
        :class="{ 'badge-unlocked': badge.unlocked }"
      >
        <div class="badge-icon">
          <span v-if="badge.icon">{{ badge.icon }}</span>
          <span v-else>🏅</span>
        </div>
        <div class="badge-info">
          <h3 class="badge-title">{{ badge.name }}</h3>
          <p class="badge-description">{{ badge.description }}</p>
          <div class="badge-status">
            <span v-if="badge.unlocked" class="status-unlocked">✅ Débloqué</span>
            <span v-else class="status-locked">🔒 À débloquer</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="!loading && !error && badges.length === 0" class="empty-container">
      <div class="empty-icon">📭</div>
      <h3>Aucun badge disponible</h3>
      <p>Les badges apparaîtront ici une fois qu'ils seront créés.</p>
    </div>
  </div>
</template>

<script>
import BadgeService from '@/services/badge.service.js';

export default {
  name: 'BadgeList',
  data() {
    return {
      badges: [],
      loading: false,
      error: null
    };
  },
  async mounted() {
    await this.loadBadges();
  },
  methods: {
    async loadBadges() {
      this.loading = true;
      this.error = null;
      
      try {
        this.badges = await BadgeService.getAllBadges();
      } catch (error) {
        this.error = error.message;
        console.error('Erreur lors du chargement des badges:', error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.badge-list-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.badge-header {
  text-align: center;
  margin-bottom: 3rem;
}

.badge-header h2 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.badge-header p {
  font-size: 1.1rem;
  color: #7f8c8d;
}

.loading-container {
  text-align: center;
  padding: 3rem;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  text-align: center;
  padding: 3rem;
  background: #fff5f5;
  border-radius: 12px;
  border: 1px solid #fed7d7;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.retry-button {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  transition: background-color 0.3s;
}

.retry-button:hover {
  background: #c53030;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.badge-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.badge-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.badge-card.badge-unlocked {
  border-color: #48bb78;
  background: linear-gradient(135deg, #f0fff4 0%, #ffffff 100%);
}

.badge-icon {
  font-size: 3rem;
  min-width: 60px;
  text-align: center;
}

.badge-info {
  flex: 1;
}

.badge-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.badge-description {
  color: #7f8c8d;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.badge-status {
  font-size: 0.9rem;
  font-weight: 500;
}

.status-unlocked {
  color: #48bb78;
}

.status-locked {
  color: #e53e3e;
}

.empty-container {
  text-align: center;
  padding: 4rem 2rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-container h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.empty-container p {
  color: #7f8c8d;
}

@media (max-width: 768px) {
  .badge-list-container {
    padding: 1rem;
  }
  
  .badges-grid {
    grid-template-columns: 1fr;
  }
  
  .badge-header h2 {
    font-size: 2rem;
  }
}
</style> 