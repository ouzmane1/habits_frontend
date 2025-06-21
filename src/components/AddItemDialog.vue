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
              placeholder="Décrivez votre habitude ou objectif..."
              rows="3"
              class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm resize-none"
            ></textarea>
            <div v-if="fieldErrors.description" class="text-red-600 text-sm mt-1">{{ fieldErrors.description }}</div>
          </div>
  
          <!-- Frequency for habits -->
          <div v-if="isHabit" class="space-y-3">
            <label class="text-sm font-medium leading-none">Fréquence</label>
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
              :class="[
                'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 py-2 text-white',
                isHabit ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'
              ]"
            >
              {{ isEditMode ? 'Modifier' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, defineProps, defineEmits, watch, nextTick, reactive } from 'vue'
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
    itemToEdit?: Item | null
  }
  
  const props = defineProps<Props>()
  
  const emit = defineEmits<{
    'update:open': [value: boolean]
    add: [item: any]
    added: []
    updated: []
  }>()
  
  const fieldErrors = ref({ title: '', description: '', date_start: '', date_end: '', frequence: '' });
  const globalError = ref('');
  
  const defaultFormData = {
    title: '',
    description: '',
    frequency: 'quotidien',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
  };

  const formData = reactive({ ...defaultFormData });
  
  const frequencies = [
    { value: 'quotidien', label: 'Quotidienne' },
    { value: 'hebdomadaire', label: 'Hebdomadaire' },
    { value: 'mensuel', label: 'Mensuelle' },
  ]
  
  const isHabit = computed(() => props.type === 'habit')
  const isEditMode = computed(() => !!props.itemToEdit);
  const title = computed(() => {
    if (isEditMode.value) {
      return isHabit.value ? 'Modifier une habitude' : 'Modifier un objectif';
    }
    return isHabit.value ? 'Ajouter une habitude' : 'Ajouter un objectif';
  });
  
  watch(() => props.open, async (isOpen) => {
    if (isOpen) {
      resetForm();
      if (isEditMode.value && props.itemToEdit) {
        await nextTick();
        populateFormWithItem(props.itemToEdit);
      }
    }
  });

  watch(() => [props.itemToEdit, props.open], async ([newItem, isOpen]) => {
    if (isOpen && isEditMode.value && newItem) {
      await nextTick();
      populateFormWithItem(newItem);
    }
  }, { deep: true });

  const populateFormWithItem = (item) => {
    console.log('Pré-remplissage du formulaire avec:', item);
    console.log('Type:', props.type, 'isHabit:', isHabit.value);
    
    const titleValue = isHabit.value ? (item.title || '') : (item.titre || '');
    console.log('Titre à définir:', titleValue);
    
    // Mise à jour directe des propriétés
    formData.title = titleValue;
    formData.description = item.description || '';
    
    if (isHabit.value) {
      formData.frequency = item.frequence || 'quotidien';
    } else {
      formData.startDate = item.date_start ? new Date(item.date_start) : undefined;
      formData.endDate = item.date_end ? new Date(item.date_end) : undefined;
    }
    
    console.log('formData après pré-remplissage:', formData);
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.title.trim()) return
  
    // Reset errors
    for (const key in fieldErrors.value) fieldErrors.value[key] = '';
    globalError.value = '';
  
    try {
      if (isEditMode.value) {
        // ----- EDIT LOGIC -----
        if (isHabit.value) {
          const payload = {
            title: formData.title,
            description: formData.description,
            frequence: formData.frequency,
          };
          await ItemService.updateHabit(props.itemToEdit.id, payload);
        } else {
           const payload = {
            titre: formData.title,
            description: formData.description,
            date_start: formData.startDate ? format(formData.startDate, 'yyyy-MM-dd') : null,
            date_end: formData.endDate ? format(formData.endDate, 'yyyy-MM-dd') : null,
          };
          await ItemService.updateObjective(props.itemToEdit.id, payload);
        }
        emit('updated');
      } else {
        // ----- CREATE LOGIC -----
        if (isHabit.value) {
          const payload = {
            title: formData.title,
            description: formData.description,
            frequence: formData.frequency,
          };
          const newHabit = await ItemService.createHabit(payload);
          emit('add', newHabit);
          emit('added');
        } else {
          const payload = {
            titre: formData.title,
            description: formData.description,
            date_start: formData.startDate ? format(formData.startDate, 'yyyy-MM-dd') : null,
            date_end: formData.endDate ? format(formData.endDate, 'yyyy-MM-dd') : null,
          };
          const newObjective = await ItemService.createObjective(payload);
          emit('add', newObjective);
          emit('added');
        }
      }
  
      resetForm()
      closeDialog()
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
      console.error("Échec de la création :", error);
    }
  }
  
  const resetForm = () => {
    formData.title = '';
    formData.description = '';
    formData.frequency = 'quotidien';
    formData.startDate = undefined;
    formData.endDate = undefined;
    for (const key in fieldErrors.value) fieldErrors.value[key] = '';
    globalError.value = '';
  }
  
  const closeDialog = () => {
    emit('update:open', false)
  }
  </script>