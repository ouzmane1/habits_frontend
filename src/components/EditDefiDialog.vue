<template>
    <div v-if="open" class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" @click="closeDialog">
      <div class="bg-background border rounded-lg shadow-lg w-full max-w-[425px] p-6" @click.stop>
        <div class="flex flex-col space-y-1.5 text-center sm:text-left mb-6">
          <h2 class="text-xl font-semibold text-gray-800">
            Modifier un défi
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
              class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700"
            >
              Modifier
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
  open: Boolean,
  defiToEdit: Object
})

const emit = defineEmits(['update:open', 'updated'])

const fieldErrors = ref({ title: '', description: '', date_start: '', date_end: '' });
const globalError = ref('');

const formData = reactive({
  title: '',
  description: '',
  startDate: undefined,
  endDate: undefined,
});

watch(() => props.defiToEdit, (newDefi) => {
  if (newDefi) {
    formData.title = newDefi.title;
    formData.description = newDefi.description;
    formData.startDate = newDefi.date_start ? new Date(newDefi.date_start) : undefined;
    formData.endDate = newDefi.date_end ? new Date(newDefi.date_end) : undefined;
  }
}, { immediate: true });


const closeDialog = () => {
  emit('update:open', false)
}

const handleSubmit = async () => {
  for (const key in fieldErrors.value) fieldErrors.value[key] = '';
  globalError.value = '';

  try {
    const payload = {
      title: formData.title,
      description: formData.description,
      date_start: formData.startDate ? format(formData.startDate, 'yyyy-MM-dd') : null,
      date_end: formData.endDate ? format(formData.endDate, 'yyyy-MM-dd') : null,
    };
    await DefiService.updateDefi(props.defiToEdit.id, payload);
    emit('updated');
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
        globalError.value = 'Une erreur est survenue lors de la modification du défi.';
    }
    console.error('Erreur lors de la modification du défi:', err);
  }
};
</script> 