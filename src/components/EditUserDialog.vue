<template>
  <div v-if="open" class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" @click="closeDialog">
    <div class="bg-background border rounded-lg shadow-lg w-full max-w-[400px] p-6" @click.stop>
      <div class="flex flex-col space-y-1.5 text-center sm:text-left mb-6">
        <h2 class="text-xl font-semibold text-gray-800">Modifier mon profil</h2>
      </div>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="space-y-2">
          <label for="name" class="text-sm font-medium leading-none">Nom</label>
          <input
            id="name"
            v-model="formData.name"
            placeholder="Votre nom"
            required
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
          />
          <div v-if="fieldErrors.name" class="text-red-600 text-sm mt-1">{{ fieldErrors.name }}</div>
        </div>
        <div class="space-y-2">
          <label for="email" class="text-sm font-medium leading-none">Email</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="Votre email"
            required
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
          />
          <div v-if="fieldErrors.email" class="text-red-600 text-sm mt-1">{{ fieldErrors.email }}</div>
        </div>
        <div v-if="globalError" class="p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {{ globalError }}
        </div>
        <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 pt-4">
          <button
            type="button"
            @click="closeDialog"
            class="border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 py-2"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 py-2 text-white bg-emerald-600 hover:bg-emerald-700"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, reactive } from 'vue'
import axios from 'axios'

const props = defineProps<{
  open: boolean,
  user: { name: string, email: string }
}>()

const emit = defineEmits<{
  'update:open': [value: boolean],
  updated: [{ name: string, email: string }]
}>()

const formData = reactive({ name: '', email: '' })
const fieldErrors = ref({ name: '', email: '' })
const globalError = ref('')

watch(() => props.user, (newUser) => {
  if (newUser) {
    console.log('props.user', newUser)
    formData.name = newUser.name || ''
    formData.email = newUser.email || ''
  }
}, { immediate: true })

const handleSubmit = async () => {
  fieldErrors.value = { name: '', email: '' }
  globalError.value = ''
  if (!formData.name.trim()) {
    fieldErrors.value.name = 'Le nom est requis.'
    return
  }
  if (!formData.email.trim()) {
    fieldErrors.value.email = 'L\'email est requis.'
    return
  }
  try {
    console.log('handleSubmit - formData', formData)
    await axios.put('/api/me', {
      name: formData.name,
      email: formData.email
    })
    emit('updated', { ...formData })
    closeDialog()
  } catch (error) {
    globalError.value = error.response?.data?.message || error.message || "Erreur lors de la mise à jour du profil."
  }
}

const closeDialog = () => {
  emit('update:open', false)
}
</script> 