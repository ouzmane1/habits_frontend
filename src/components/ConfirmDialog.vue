<template>
  <div v-if="open" class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" @click="closeDialog">
    <div class="bg-background border rounded-lg shadow-lg w-full max-w-[400px] p-6" @click.stop>
      <div class="flex flex-col space-y-1.5 text-center sm:text-left mb-6">
        <h2 class="text-xl font-semibold text-gray-800">
          Confirmer la suppression
        </h2>
      </div>

      <div class="space-y-4">
        <p class="text-gray-600">
          Êtes-vous sûr de vouloir supprimer <strong>{{ itemName }}</strong> ?
        </p>
        <p class="text-sm text-gray-500">
          Cette action est irréversible.
        </p>
      </div>

      <div v-if="error" class="p-3 bg-red-50 text-red-700 rounded-md text-sm mt-4">
        {{ error }}
      </div>

      <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 pt-6">
        <button
          type="button"
          @click="closeDialog"
          class="border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 py-2"
        >
          Annuler
        </button>
        <button
          type="button"
          @click="confirmDelete"
          :disabled="isDeleting"
          class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 py-2 text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isDeleting">Suppression...</span>
          <span v-else>Supprimer</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'
import ItemService from '@/services/item.service.js'
import DefiService from '@/services/defi.service.js'

interface Props {
  open: boolean
  itemToDelete: {
    id: number
    title?: string
    titre?: string
    type: 'habit' | 'objective' | 'defi'
  } | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  deleted: []
}>()

const isDeleting = ref(false)
const error = ref('')

const itemName = computed(() => {
  if (!props.itemToDelete) return ''
  return props.itemToDelete.title || props.itemToDelete.titre || 'cet élément'
})

const confirmDelete = async () => {
  if (!props.itemToDelete) return

  isDeleting.value = true
  error.value = ''

  try {
    if (props.itemToDelete.type === 'habit') {
      await ItemService.deleteHabit(props.itemToDelete.id)
    } else if (props.itemToDelete.type === 'objective') {
      await ItemService.deleteObjective(props.itemToDelete.id)
    } else if (props.itemToDelete.type === 'defi') {
      await DefiService.deleteDefi(props.itemToDelete.id)
    }
    
    emit('deleted')
    closeDialog()
  } catch (err) {
    error.value = err.response?.data?.message || err.message || "Une erreur est survenue lors de la suppression."
    console.error("Erreur de suppression:", err)
  } finally {
    isDeleting.value = false
  }
}

const closeDialog = () => {
  emit('update:open', false)
  error.value = ''
  isDeleting.value = false
}
</script> 