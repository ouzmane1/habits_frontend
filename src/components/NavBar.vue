<template>
    <header class="bg-white py-4 px-6 flex items-center justify-between shadow-md sticky top-0 z-50">
      <div class="flex items-center space-x-8">
        <div class="font-bold text-xl text-primary">LOGO</div>
        
        <!-- Desktop Navigation -->
        <nav class="hidden md:flex space-x-6">
          <router-link 
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path" 
            :class="[
              'px-3 py-2 rounded-lg transition-colors font-medium',
              isActive(item.path) 
                ? 'bg-primary/10 text-primary' 
                : 'hover:bg-muted hover:text-primary'
            ]"
          >
            {{ item.label }}
          </router-link>
        </nav>
      </div>
      
      <div class="flex items-center space-x-2">
        <button 
          class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 rounded-full hover:bg-primary/10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
            <path d="m13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>
        <button 
          class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 rounded-full hover:bg-primary/10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </button>
        
        <!-- Mobile menu button -->
        <button
          class="md:hidden inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 rounded-full hover:bg-primary/10"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600">
            <line x1="4" x2="20" y1="6" y2="6"/>
            <line x1="4" x2="20" y1="12" y2="12"/>
            <line x1="4" x2="20" y1="18" y2="18"/>
          </svg>
        </button>
      </div>
      
      <!-- Mobile Navigation -->
      <div v-if="mobileMenuOpen" class="md:hidden absolute top-full left-0 right-0 bg-white shadow-md p-4 border-t border-gray-100">
        <nav class="flex flex-col space-y-3">
          <router-link 
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path" 
            :class="[
              'px-4 py-2 rounded-lg transition-colors',
              isActive(item.path) 
                ? 'bg-primary/10 text-primary' 
                : 'hover:bg-muted'
            ]"
            @click="mobileMenuOpen = false"
          >
            {{ item.label }}
          </router-link>
        </nav>
      </div>
    </header>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  
  const route = useRoute()
  const mobileMenuOpen = ref(false)
  
  const navigationItems = [
    { path: "/", label: "Accueil" },
    { path: "/mes-taches", label: "Mes Tâches" },
    { path: "/defis", label: "Défis" },
    { path: "/mes-badges", label: "Mes Badges" }
  ]
  
  const isActive = (path: string) => route.path === path
  </script>
  
  <style scoped>
  /* Primary color: hsl(159, 60%, 48%) - #32C48D */
  .text-primary {
    color: hsl(159, 60%, 48%);
  }
  
  .bg-primary\/10 {
    background-color: hsl(159, 60%, 48%, 0.1);
  }
  
  .hover\:bg-primary\/10:hover {
    background-color: hsl(159, 60%, 48%, 0.1);
  }
  
  .hover\:text-primary:hover {
    color: hsl(159, 60%, 48%);
  }
  
  .bg-muted {
    background-color: hsl(210, 40%, 96.1%);
  }
  
  .hover\:bg-muted:hover {
    background-color: hsl(210, 40%, 96.1%);
  }
  
  .hover\:bg-accent:hover {
    background-color: hsl(210, 40%, 96.1%);
  }
  
  .hover\:text-accent-foreground:hover {
    color: hsl(222.2, 47.4%, 11.2%);
  }
  
  .border-input {
    border-color: hsl(214.3, 31.8%, 91.4%);
  }
  
  .bg-background {
    background-color: hsl(0, 0%, 100%);
  }
  
  .ring-offset-background {
    --tw-ring-offset-color: hsl(0, 0%, 100%);
  }
  
  .focus-visible\:ring-ring:focus-visible {
    --tw-ring-color: hsl(159, 60%, 48%);
  }
  
  .ring-offset-2:focus-visible {
    --tw-ring-offset-width: 2px;
  }
  </style>