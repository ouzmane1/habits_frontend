<template>
  <div v-if="open" class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" @click="closeDialog">
    <div class="bg-background border rounded-lg shadow-lg w-full max-w-[425px] p-6" @click.stop>
      <div class="flex flex-col space-y-1.5 text-center sm:text-left mb-6">
        <h2 class="text-xl font-semibold text-gray-800">
          {{ title }}
        </h2>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="space-y-2">
          <label for="title" class="text-sm font-medium leading-none">Titre</label>
          <input
            id="title"
            v-model="formData.title"
            :placeholder="isHabit ? 'Ex: 30 min de sport' : 'Ex: Perdre 5kg'"
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
            placeholder="Decrivez votre habitude ou objectif..."
            rows="3"
            class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm resize-none"
          ></textarea>
          <div v-if="fieldErrors.description" class="text-red-600 text-sm mt-1">{{ fieldErrors.description }}</div>
        </div>

        <!-- Frequency for habits -->
        <div v-if="isHabit" class="space-y-3">
          <label class="text-sm font-medium leading-none">Frequence</label>
          <div class="flex gap-2">
            <button
              v-for="freq in frequencies"
              :key="freq.value"
              type="button"
              @click="formData.frequency = freq.value"
              :class="[
                'flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-9 px-3',
                formData.frequency === freq.value 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
              ]"
            >
              {{ freq.label }}
            </button>
          </div>
          <div v-if="fieldErrors.frequence" class="text-red-600 text-sm mt-1">{{ fieldErrors.frequence }}</div>
        </div>

        <!-- Dates for objectives -->
        <div v-else class="space-y-4">
          <DateSelector
            v-model="formData.startDate"
            label="Date de debut"
            placeholder="Selectionner une date de debut"
          />
          <div v-if="fieldErrors.date_start" class="text-red-600 text-sm -mt-2">{{ fieldErrors.date_start }}</div>

          <DateSelector
            v-model="formData.endDate"
            label="Date de fin"
            placeholder="Selectionner une date de fin"
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
            :class="[
              'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 py-2 text-white',
              isHabit ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'
            ]"
          >
            Modifier
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, watch } from 'vue'
import { format } from 'date-fns';
import DateSelector from './DateSelector.vue'
import ItemService from '@/services/item.service.js'

interface Item {
  id: number;
  title?: string;
  titre?: string;
  description?: string;
  frequence?: string;
  date_start?: string;
  date_end?: string;
}

interface Props {
  open: boolean
  type: 'habit' | 'objective'
  itemToEdit: Item
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  updated: []
}>()

const fieldErrors = ref({ title: '', description: '', date_start: '', date_end: '', frequence: '' });
const globalError = ref('');

const formData = ref({
  title: '',
  description: '',
  frequency: 'quotidien',
  startDate: undefined as Date | undefined,
  endDate: undefined as Date | undefined,
});

const frequencies = [
  { value: 'quotidien', label: 'Quotidienne' },
  { value: 'hebdomadaire', label: 'Hebdomadaire' },
  { value: 'mensuel', label: 'Mensuelle' },
]

const isHabit = computed(() => props.type === 'habit')
const title = computed(() => isHabit.value ? 'Modifier une habitude' : 'Modifier un objectif')

// Pre-remplir le formulaire quand l'item change
watch(() => props.itemToEdit, (newItem) => {
  if (newItem) {
    populateForm(newItem);
  }
}, { immediate: true });

const populateForm = (item) => {
  console.log('Pre-remplissage avec:', item);
  formData.value.title = isHabit.value ? (item.title || '') : (item.titre || '');
  formData.value.description = item.description || '';
  
  if (isHabit.value) {
    formData.value.frequency = item.frequence || 'quotidien';
  } else {
    formData.value.startDate = item.date_start ? new Date(item.date_start) : undefined;
    formData.value.endDate = item.date_end ? new Date(item.date_end) : undefined;
  }
  console.log('Formulaire rempli:', formData.value);
};

const handleSubmit = async () => {
  if (!formData.value.title.trim()) return

  // Reset errors
  for (const key in fieldErrors.value) fieldErrors.value[key] = '';
  globalError.value = '';

  try {
    if (isHabit.value) {
      const payload = {
        title: formData.value.title,
        description: formData.value.description,
        frequence: formData.value.frequency,
      };
      await ItemService.updateHabit(props.itemToEdit.id, payload);
    } else {
      const payload = {
        titre: formData.value.title,
        description: formData.value.description,
        date_start: formData.value.startDate ? format(formData.value.startDate, 'yyyy-MM-dd') : null,
        date_end: formData.value.endDate ? format(formData.value.endDate, 'yyyy-MM-dd') : null,
      };
      await ItemService.updateObjective(props.itemToEdit.id, payload);
    }
    
    emit('updated');
    closeDialog();
  } catch (error) {
    if ((error.response?.status === 400 || error.response?.status === 422) && error.response?.data?.errors) {
      const backendErrors = error.response.data.errors;
      for (const field in backendErrors) {
        if (Object.prototype.hasOwnProperty.call(fieldErrors.value, field)) {
          fieldErrors.value[field] = Array.isArray(backendErrors[field]) ? backendErrors[field][0] : backendErrors[field];
        }
      }
    } else {
      globalError.value = error.response?.data?.message || error.message || "Une erreur est survenue.";
    }
    console.error("Echec de la modification :", error);
  }
}

const closeDialog = () => {
  emit('update:open', false)
}
</script> 