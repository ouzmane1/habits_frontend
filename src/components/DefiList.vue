<template>
  <Card class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-2">
        <Trophy class="text-purple-600" :size="24" />
        <h2 class="text-xl font-semibold text-gray-800">Défis</h2>
      </div>
    </div>

    <div class="space-y-4 max-h-[350px] overflow-y-auto pr-2">
      <div
        v-for="defi in defis"
        :key="defi.id"
        class="p-4 bg-purple-50 rounded-lg border border-purple-200"
      >
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-white text-sm">🏆</span>
          </div>
          <div class="flex-1">
            <h3 class="font-medium text-gray-800 mb-1">{{ defi.title || defi.titre }}</h3>
            <p v-if="defi.description" class="text-sm text-gray-600 mb-2">{{ defi.description }}</p>
            
            <div class="flex items-center gap-2 mb-2">
              <Badge variant="outline" class="text-xs bg-purple-100 text-purple-700 border-purple-300">
                {{ defi.category || 'Défi' }}
              </Badge>
              <span v-if="defi.difficulty" class="text-sm text-gray-600">
                Difficulté: {{ defi.difficulty }}
              </span>
            </div>

            <div v-if="defi.reward" class="flex items-center gap-2">
              <span class="text-sm text-gray-600">Récompense:</span>
              <Badge class="bg-yellow-100 text-yellow-700">
                {{ defi.reward }}
              </Badge>
            </div>

            <div v-if="defi.progress !== undefined" class="mt-3">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600">Progression</span>
                <span class="font-medium text-purple-600">{{ defi.progress }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${defi.progress}%` }"
                ></div>
              </div>
            </div>

            <div v-if="defi.deadline" class="mt-2 text-sm text-gray-500">
              <span>Échéance: {{ formatDate(defi.deadline) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="defis.length === 0" class="text-center py-8 text-gray-500">
        <Trophy class="mx-auto mb-2 text-gray-300" :size="32" />
        <p>Aucun défi disponible pour le moment</p>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import { Trophy } from 'lucide-vue-next'

interface Defi {
  id: number
  title?: string
  titre?: string
  description?: string
  category?: string
  difficulty?: string
  reward?: string
  progress?: number
  deadline?: string
}

interface Props {
  defis: Defi[]
}

const props = defineProps<Props>()

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  } catch {
    return dateString
  }
}
</script> 