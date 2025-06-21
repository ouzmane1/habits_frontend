<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Header -->
    <div class="h-16 bg-white flex items-center px-6">
      <RouterLink to="/" class="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
        Habits
      </RouterLink>
    </div>

    <!-- Main Content -->
    <main class="flex-1 flex items-center justify-center p-4">
      <div class="w-full max-w-md flex justify-center">
        <div class="rounded-xl border bg-white overflow-hidden shadow-lg border-t-4 border-primary">
          <div class="px-8 pt-8 flex flex-col items-center bg-gradient-to-r from-primary/10 to-secondary/10">
            <h1 class="text-2xl font-bold mb-2 text-center">{{ isLogin ? 'Connexion' : 'Inscription' }}</h1>
            <p class="text-gray-600 mb-6 text-center">
              {{ isLogin 
                ? 'Connectez-vous pour accéder à votre tableau de bord'
                : 'Créez un compte pour commencer à suivre vos habitudes'
              }}
            </p>
          </div>

          <div v-if="error" class="mx-8 p-2 text-red-600 rounded-md">
            {{ error }}
          </div>

          <form class="flex flex-col items-center px-8 pb-8 pt-8" @submit.prevent="handleSubmit">
            <div v-if="!isLogin" class="space-y-4 w-full mb-4">
              <label for="name" class="block text-sm font-medium mb-1 text-left">Nom</label>
              <div class="relative mt-1">
                <User class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="name"
                  v-model="formData.name"
                  type="text"
                  placeholder="Votre nom"
                  class="w-full px-10 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white text-gray-700"
                  required
                />
              </div>
              <div v-if="fieldErrors.name" class="text-red-600 text-sm mt-1">{{ fieldErrors.name }}</div>
            </div>

            <div class="w-full mb-4">
              <label for="email" class="block text-sm font-medium mb-1 text-left">Email</label>
              <div class="relative">
                <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  placeholder="votre@email.com"
                  class="w-full px-10 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white text-gray-700"
                  required
                />
              </div>
              <div v-if="fieldErrors.email" class="text-red-600 text-sm mt-1">{{ fieldErrors.email }}</div>
            </div>

            <div class="w-full mb-4">
              <div class="flex items-center justify-between mb-1">
                <label for="password" class="block text-sm font-medium">Mot de passe</label>
                <RouterLink v-if="isLogin" to="/reset-password" class="text-sm hover:underline text-emerald-600">
                  Mot de passe oublié?
                </RouterLink>
              </div>
              <div class="relative">
                <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  class="w-full px-10 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 pr-10 bg-white text-gray-700"
                  required
                />
                <button type="button" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700" @click="showPassword = !showPassword">
                  <EyeOff v-if="showPassword" class="h-5 w-5" />
                  <Eye v-else class="h-5 w-5" />
                </button>
              </div>
              <div v-if="fieldErrors.password" class="text-red-600 text-sm mt-1">{{ fieldErrors.password }}</div>
            </div>

            <div v-if="isLogin" class="flex items-center space-x-2 w-[90%] mb-6">
              <input
                id="remember"
                v-model="formData.rememberMe"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-400"
              />
              <label for="remember" class="text-sm text-gray-700">Se souvenir de moi</label>
            </div>

            <button
              type="submit"
              class="w-full py-2.5 rounded-md font-semibold transition mb-6 bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
              :disabled="loading"
            >
              {{ loading ? 'Chargement...' : isLogin ? 'Se connecter' : 'S\'inscrire' }}
            </button>

            <!-- Séparateur OU CONTINUER AVEC -->
            <div class="relative my-4 w-full">
              <div class="absolute inset-0 flex items-center">
                <span class="w-full border-t border-gray-200"></span>
              </div>
              <div class="relative flex justify-center text-xs uppercase">
                <span class="bg-white px-2 text-gray-400">ou continuer avec</span>
              </div>
            </div>

            <!-- Boutons Google -->
            <div class="w-full mb-6">
              <button type="button" class="w-full py-2.5 rounded-md border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-primary/10 transition cursor-pointer flex items-center justify-center gap-2">
                <img src="/src/assets/img/google.png" alt="Google Icon" class="h-5 w-5" />
                Google
              </button>
            </div>

            <div class="text-center w-full mx-auto">
              <p class="text-sm text-gray-700">
                {{ isLogin ? 'Vous n\'avez pas de compte ?' : 'Vous avez déjà un compte ?' }}
                <button
                  type="button"
                  @click="isLogin = !isLogin; formData.email = '';
                  formData.password = '';
                  formData.name = '';
                  formData.rememberMe = false; 
                  error = ''"
                  class="font-medium hover:underline text-emerald-600">
                  {{ isLogin ? 'S\'inscrire' : 'Se connecter' }}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { Eye, Lock, Mail, EyeOff, User } from 'lucide-vue-next'
import AuthService from '@/services/auth.service'
import { useRouter } from 'vue-router'

const isLogin = ref(true)
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const fieldErrors = reactive({ email: '', password: '', name: '' });

const formData = reactive({
  email: '',
  password: '',
  name: '',
  rememberMe: false
})

const router = useRouter()

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  error.value = ''
  loading.value = true

  for (const key in fieldErrors) fieldErrors[key] = '';
  error.value = '';

  try {
    if (isLogin.value) {
      // Appelle ton AuthService.login pour la connexion
      await AuthService.login(formData.email, formData.password)
      console.log('Login successful')
      console.log('Utilisateur connecté:', AuthService.getUserInfo())
      // Redirection après succès de la connexion
      // router.push('/mes-taches') // Décommenter pour rediriger
    } else {
      
      // Appelle ton AuthService.register pour l'inscription
      await AuthService.register(formData.email, formData.password, formData.name)
      console.log('Registration successful')
      // Connexion automatique juste après l'inscription :
      await AuthService.login(formData.email, formData.password);
      console.log('Auto-login after registration successful');
      // Optionnel: Rediriger vers la page de connexion ou afficher un message
      // isLogin.value = true // Exemple: basculer vers la connexion après inscription
    }

    // Redirection générique ou autre action après succès
    // Par exemple, rediriger toujours vers '/mes-taches' après connexion ou inscription
    router.push('/');

  } catch (err: any) {
    console.error('Auth error:', err)
    // 1. Réinitialise toutes les erreurs de champ
    for (const key in fieldErrors) fieldErrors[key] = '';

    // 2. Par défaut, pas d'erreur globale
    let displayMessage = '';

    // 3. Gestion des erreurs de validation du backend
    if (err.response?.status === 400 && err.response?.data?.errors && typeof err.response.data.errors === 'object') {
      // Remplit UNIQUEMENT les champs présents dans la réponse du backend
      for (const field in err.response.data.errors) {
        if (Object.prototype.hasOwnProperty.call(err.response.data.errors, field)) {
          const msg = Array.isArray(err.response.data.errors[field])
            ? err.response.data.errors[field][0]
            : err.response.data.errors[field];
          fieldErrors[field] = msg;
        }
      }
      // IMPORTANT : NE PAS mettre de message global si c'est une erreur de validation par champ
      error.value = '';
      return; // <-- AJOUTE CE return pour ne pas écraser les erreurs de champ avec un message global !
    }

    // 4. Gestion des autres erreurs globales
    if (err.message === 'No refresh token available') {
      displayMessage = 'Email ou mot de passe incorrect';
    } else if (err.response?.data?.detail) {
      displayMessage = err.response.data.detail;
    } else if (err.response?.data?.message) {
      displayMessage = err.response.data.message;
    } else if (err.response) {
      displayMessage = `Erreur de requête: ${err.response.status} ${err.response.statusText}`;
    } else {
      displayMessage = err.message || 'Erreur réseau ou inconnue';
    }

    error.value = displayMessage;
  } finally {
      loading.value = false
    }
}
</script>
