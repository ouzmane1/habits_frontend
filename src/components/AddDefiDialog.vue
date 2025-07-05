<template>
    <div v-if="open" class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" @click="closeDialog">
      <div class="bg-background border rounded-lg shadow-lg w-full max-w-[425px] p-6" @click.stop>
        <div class="flex flex-col space-y-1.5 text-center sm:text-left mb-6">
          <h2 class="text-xl font-semibold text-gray-800">
            Créer un défi
          </h2>
        </div>
  
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="space-y-2">
            <label for="title" class="text-sm font-medium leading-none">Titre</label>
            <input
              id="title"
              v-model="formData.title"
              placeholder="Ex: Courir 5km"
              required
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
            />
            <div v-if="fieldErrors.title" class="text-red-600 text-sm mt-1">{{ fieldErrors.title }}</div>
          </div>
  
          <div class="space-y-2">
            <label for="description" class="text-sm font-medium leading-none">Description</label>
            <textarea
              id="description"
              v-model="formData.description"
              placeholder="Décrivez votre défi..."
              rows="3"
              class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm resize-none"
            ></textarea>
            <div v-if="fieldErrors.description" class="text-red-600 text-sm mt-1">{{ fieldErrors.description }}</div>
          </div>
  
          <div class="space-y-4">
            <DateSelector
              v-model="formData.startDate"
              label="Date de début"
              placeholder="Sélectionner une date de début"
            />
            <div v-if="fieldErrors.date_start" class="text-red-600 text-sm -mt-2">{{ fieldErrors.date_start }}</div>
  
            <DateSelector
              v-model="formData.endDate"
              label="Date de fin"
              placeholder="Sélectionner une date de fin"
            />
            <div v-if="fieldErrors.date_end" class="text-red-600 text-sm -mt-2">{{ fieldErrors.date_end }}</div>
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
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
</template>
  
<script setup>
import { ref, reactive, watch } from 'vue'
import { format } from 'date-fns'
import DateSelector from './DateSelector.vue'
import DefiService from '@/services/defi.service.js'

const props = defineProps({
  open: Boolean
})

const emit = defineEmits(['update:open', 'created'])

const fieldErrors = ref({ title: '', description: '', date_start: '', date_end: '' });
const globalError = ref('');

const defaultFormData = {
  title: '',
  description: '',
  startDate: undefined,
  endDate: undefined,
};

const formData = reactive({ ...defaultFormData });

const resetForm = () => {
  Object.assign(formData, defaultFormData);
  for (const key in fieldErrors.value) fieldErrors.value[key] = '';
  globalError.value = '';
};

const closeDialog = () => {
  emit('update:open', false)
}

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    resetForm();
  }
});

const handleSubmit = async () => {
  for (const key in fieldErrors.value) fieldErrors.value[key] = '';
  globalError.value = '';

  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const payload = {
      title: formData.title,
      description: formData.description,
      date_start: formData.startDate ? format(formData.startDate, 'yyyy-MM-dd') : null,
      date_end: formData.endDate ? format(formData.endDate, 'yyyy-MM-dd') : null,
      created_by: user ? user.email : null,
    };
    console.log('Données envoyées pour la création du défi:', payload);
    await DefiService.createDefi(payload);
    emit('created');
    closeDialog();
  } catch (err) {
    if (err.response && err.response.data && err.response.data.errors) {
        const errors = err.response.data.errors;
        for (const key in errors) {
            if (fieldErrors.value.hasOwnProperty(key)) {
                fieldErrors.value[key] = errors[key][0];
            }
        }
    } else {
        globalError.value = 'Une erreur est survenue lors de la création du défi.';
    }
    console.error('Erreur lors de la création du défi:', err);
  }
};
</script> 