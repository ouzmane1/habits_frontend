<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="mb-8">
          <WelcomeSlider userName="Marie" />
        </div>
  
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Habitudes -->
          <Card class="p-6">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-2">
                <CheckCircle class="text-emerald-600" size="24" />
                <h2 class="text-xl font-semibold text-gray-800">Habitudes</h2>
              </div>
              <Button size="sm" class="bg-emerald-600 hover:bg-emerald-700 text-white" @click="habitDialogOpen = true">
                <Plus size="16" class="mr-2" /> Ajouter
              </Button>
            </div>
  
            <div class="space-y-4 max-h-[350px] overflow-y-auto pr-2">
              <div
                v-for="habit in habits"
                :key="habit.id"
                class="p-4 bg-emerald-50 rounded-lg border border-emerald-200"
              >
                <div class="flex items-start gap-3">
                  <Checkbox class="mt-1" :checked="habit.completed" @change="toggleHabit(habit.id)" />
                  <div class="flex-1">
                    <h3 class="font-medium text-gray-800 mb-1">{{ habit.title }}</h3>
                    <div class="flex items-center gap-2 bg-emerald-50">
                      <Badge variant="outline" class="text-xs">{{ habit.frequence }}</Badge>
                    </div>
                  </div>
                  <div class="flex flex-col gap-2 ml-2">
                    <button @click="editHabit(habit)" class="text-blue-500 hover:text-blue-700">
                      <Pencil size="18" />
                    </button>
                    <button @click="deleteHabit(habit)" class="text-red-500 hover:text-red-700">
                      <Trash size="18" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
  
          <!-- Objectifs -->
          <Card class="p-6">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-2">
                <Target class="text-blue-600" size="24" />
                <h2 class="text-xl font-semibold text-gray-800">Objectifs</h2>
              </div>
              <Button size="sm" class="bg-blue-600 hover:bg-blue-700 text-white" @click="objectiveDialogOpen = true">
                <Plus size="16" class="mr-2" /> Ajouter
              </Button>
            </div>
  
            <div class="space-y-4 max-h-[350px] overflow-y-auto pr-2">
              <div
                v-for="objective in objectives"
                :key="objective.id"
                class="p-4 bg-blue-50 rounded-lg border border-blue-200"
              >
                <div class="flex items-start gap-3">
                  <div class="flex-1">
                    <h3 class="font-medium text-gray-800 mb-1">{{ objective.titre }}</h3>
                    <div class="flex items-center gap-2 mb-2">
                      <Badge variant="outline" class="text-xs">{{ objective.category }}</Badge>
                      <span class="text-sm text-gray-600">{{ objective.target }}</span>
                    </div>
                    <div class="space-y-2">
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Progression</span>
                        <span class="font-medium text-blue-600">{{ objective.progress }}%</span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-2">
                        <div
                          class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          :style="{ width: `${objective.progress}%` }"
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col gap-2 ml-2">
                    <button @click="editObjective(objective)" class="text-blue-500 hover:text-blue-700">
                      <Pencil size="18" />
                    </button>
                    <button @click="deleteObjective(objective)" class="text-red-500 hover:text-red-700">
                      <Trash size="18" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <!-- Accomplissements -->
          <Card class="p-6">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-2">
                <TrendingUp class="text-purple-600" size="24" />
                <h2 class="text-xl font-semibold text-gray-800">Accomplissements</h2>
              </div>
            </div>

            <div class="space-y-4 max-h-[350px] overflow-y-auto pr-2">
              <div class="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div class="flex items-center gap-3">
                  <div class="flex-1">
                    <h3 class="font-medium text-gray-800 mb-1">Première habitude</h3>
                    <p class="text-sm text-gray-600">Vous avez créé votre première habitude</p>
                  </div>
                  <Badge variant="outline" class="text-xs bg-purple-100">Nouveau</Badge>
                </div>
              </div>

              <div class="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div class="flex items-center gap-3">
                  <div class="flex-1">
                    <h3 class="font-medium text-gray-800 mb-1">Objectif atteint</h3>
                    <p class="text-sm text-gray-600">Vous avez atteint un objectif</p>
                  </div>
                  <Badge variant="outline" class="text-xs bg-purple-100">Nouveau</Badge>
                </div>
              </div>

              <div class="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div class="flex items-center gap-3">
                  <div class="flex-1">
                    <h3 class="font-medium text-gray-800 mb-1">Série de 7 jours</h3>
                    <p class="text-sm text-gray-600">Vous avez maintenu une habitude pendant 7 jours</p>
                  </div>
                  <Badge variant="outline" class="text-xs bg-purple-100">Nouveau</Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
    <AddItemDialog
      :open="habitDialogOpen"
      type="habit"
      @update:open="habitDialogOpen = $event"
      @add="handleAddHabit"
      @added="reloadData"
    />

    <AddItemDialog
      :open="objectiveDialogOpen"
      type="objective"
      @update:open="objectiveDialogOpen = $event"
      @add="handleAddObjective"
      @added="reloadData"
    />

    <EditItemDialog
      :open="isEditDialogOpen"
      :type="itemType"
      :itemToEdit="itemToEdit"
      @update:open="isEditDialogOpen = $event"
      @updated="handleItemUpdated"
    />

    <ConfirmDialog
      :open="confirmDialogOpen"
      :itemToDelete="itemToDelete"
      @update:open="confirmDialogOpen = $event"
      @deleted="handleConfirmed"
    />
</template>
  
<script setup>
  import { ref, onMounted } from 'vue';
  import WelcomeSlider from '@/components/WelcomeSlider.vue';
  import AddItemDialog from '@/components/AddItemDialog.vue';
  import EditItemDialog from '@/components/EditItemDialog.vue';
  import ConfirmDialog from '@/components/ConfirmDialog.vue';
  import Card from '@/components/ui/Card.vue';
  import Button from '@/components/ui/Button.vue';
  import Checkbox from '@/components/ui/Checkbox.vue';
  import Badge from '@/components/ui/Badge.vue';
  import { Plus, Target, CheckCircle, TrendingUp, Pencil, Trash } from 'lucide-vue-next';
  import ItemService from '@/services/item.service.js';
  
  const habits = ref([]);
  const objectives = ref([]);
  
  const toggleHabit = (id) => {
    const habit = habits.value.find((h) => h.id === id);
    if (habit) habit.completed = !habit.completed;
  };
  
  const habitDialogOpen = ref(false);
  const objectiveDialogOpen = ref(false);
  
  const isEditDialogOpen = ref(false);
  const itemToEdit = ref(null);
  const itemType = ref('habit');

  const confirmDialogOpen = ref(false);
  const itemToDelete = ref(null);

  const handleAddHabit = (newHabit) => {
    habits.value.push({
      ...newHabit,
      completed: false,
      streak: 0,
    });
  };

  const handleAddObjective = (newObjective) => {
    objectives.value.push({
      ...newObjective,
      progress: 0,
    });
  };

  const reloadData = async () => {
    try {
      const [habitsData, objectivesData] = await Promise.all([
        ItemService.getHabits(),
        ItemService.getObjectives()
      ]);
      habits.value = habitsData;
      objectives.value = objectivesData;
    } catch (error) {
      console.error('Erreur lors du rechargement des données utilisateur:', error);
    }
  };

  const editHabit = (habit) => {
    console.log('Édition habitude:', habit);
    itemType.value = 'habit';
    itemToEdit.value = habit;
    isEditDialogOpen.value = true;
    console.log('État après édition habitude:', {
      itemType: itemType.value,
      itemToEdit: itemToEdit.value,
      isEditDialogOpen: isEditDialogOpen.value
    });
  };

  const deleteHabit = (habit) => {
    console.log('Supprimer habitude:', habit);
    itemToDelete.value = {
      id: habit.id,
      title: habit.title,
      type: 'habit'
    };
    confirmDialogOpen.value = true;
  };

  const editObjective = (objective) => {
    console.log('Édition objectif:', objective);
    itemType.value = 'objective';
    itemToEdit.value = objective;
    isEditDialogOpen.value = true;
    console.log('État après édition objectif:', {
      itemType: itemType.value,
      itemToEdit: itemToEdit.value,
      isEditDialogOpen: isEditDialogOpen.value
    });
  };

  const deleteObjective = (objective) => {
    console.log('Supprimer objectif:', objective);
    itemToDelete.value = {
      id: objective.id,
      titre: objective.titre,
      type: 'objective'
    };
    confirmDialogOpen.value = true;
  };

  const handleItemUpdated = () => {
    isEditDialogOpen.value = false;
    reloadData();
  }

  const handleConfirmed = () => {
    confirmDialogOpen.value = false;
    itemToDelete.value = null;
    reloadData();
  }

  onMounted(reloadData);
</script>
  

  