<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-white to-primary/5">
    <div class="h-16 bg-white shadow-sm flex items-center px-6">
      <RouterLink to="/" class="font-bold text-xl text-gradient-primary">HabitTracker</RouterLink>
    </div>

    <main class="flex-1 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <Card class="shadow-lg border-t-4 border-primary">
          <CardHeader class="space-y-1 text-center bg-gradient-to-r from-primary/10 to-secondary/10 pb-6">
            <CardTitle class="text-2xl font-bold">
              {{ isLogin ? 'Connexion' : 'Créer un compte' }}
            </CardTitle>
            <p class="text-sm text-gray-600">
              {{ isLogin
                ? 'Connectez-vous pour accéder à votre tableau de bord'
                : 'Créez un compte pour commencer à suivre vos habitudes' }}
            </p>
          </CardHeader>

          <CardContent class="pt-6">
            <Alert v-if="error" variant="destructive" class="mb-6">
              <AlertDescription>{{ error }}</AlertDescription>
            </Alert>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div v-if="!isLogin" class="space-y-2">
                <Label for="name">Nom</Label>
                <div class="relative">
                  <User class="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="name"
                    placeholder="Votre nom"
                    class="pl-10"
                    v-model="name"
                    :disabled="loading"
                    required
                  />
                </div>
              </div>

              <div class="space-y-2">
                <Label for="email">Email</Label>
                <div class="relative">
                  <Mail class="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    class="pl-10"
                    v-model="email"
                    :disabled="loading"
                    required
                  />
                </div>
              </div>

              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <Label for="password">Mot de passe</Label>
                  <RouterLink v-if="isLogin" to="/reset-password" class="text-xs text-primary hover:underline">
                    Mot de passe oublié?
                  </RouterLink>
                </div>
                <div class="relative">
                  <Lock class="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    class="pl-10 pr-10"
                    v-model="password"
                    :disabled="loading"
                    required
                  />
                  <button
                    type="button"
                    class="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                    @click="togglePasswordVisibility"
                  >
                    <component :is="showPassword ? EyeOff : Eye" class="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div v-if="isLogin" class="flex items-center space-x-2">
                <Checkbox id="remember" v-model:checked="rememberMe" />
                <label
                  for="remember"
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Se souvenir de moi
                </label>
              </div>

              <Button
                type="submit"
                class="w-full bg-gradient-to-r from-primary to-primary/80 hover:opacity-90"
                :disabled="loading"
              >
                {{ loading ? 'Chargement...' : isLogin ? 'Se connecter' : 'Créer un compte' }}
              </Button>

              <div class="relative my-4">
                <div class="absolute inset-0 flex items-center">
                  <span class="w-full border-t"></span>
                </div>
                <div class="relative flex justify-center text-xs uppercase">
                  <span class="bg-background px-2 text-muted-foreground">
                    ou continuer avec
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <Button type="button" variant="outline" :disabled="loading" class="text-gray-800">
                  Google
                </Button>
                <Button type="button" variant="outline" :disabled="loading" class="text-gray-800">
                  Facebook
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter class="flex flex-col space-y-4 border-t pt-6 text-center">
            <div class="text-sm">
              <span v-if="isLogin">
                Vous n'avez pas de compte?
                <button
                  @click="isLogin = false"
                  class="text-primary font-semibold hover:underline"
                  :disabled="loading"
                >
                  S'inscrire
                </button>
              </span>
              <span v-else>
                Vous avez déjà un compte?
                <button
                  @click="isLogin = true"
                  class="text-primary font-semibold hover:underline"
                  :disabled="loading"
                >
                  Se connecter
                </button>
              </span>
            </div>
          </CardFooter>
        </Card>

        <p class="text-center text-gray-500 text-xs mt-4">
          En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
        </p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-vue-next'
//import { useToast } from '@/composables/use-toast'

// Composants UI
import { Card } from '@/components/ui/Card.vue'
import { CardHeader } from '@/components/ui/CardHeader.vue'
import { CardContent } from '@/components/ui/CardContent.vue'
import { CardFooter } from '@/components/ui/CardFooter.vue'
import { CardTitle } from '@/components/ui/CardTitle.vue'
import { CardDescription } from '@/components/ui/CardDescription.vue'
import { Button } from '@/components/ui/Button.vue'
import { Input } from '@/components/ui/Input.vue'
import { Label } from '@/components/ui/Label.vue'
import { Checkbox } from '@/components/ui/Checkbox.vue'
import { Alert } from '@/components/ui/Alert.vue'
import { AlertDescription } from '@/components/ui/AlertDescription.vue'

const router = useRouter()
//const { toast } = useToast()

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const name = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log(isLogin.value ? 'Login' : 'Register', {
      email: email.value,
      password: password.value,
      name: name.value,
      rememberMe: rememberMe.value,
    })

    toast({
      title: isLogin.value ? 'Connexion réussie' : 'Compte créé avec succès',
      description: isLogin.value
        ? 'Bienvenue sur votre tableau de bord'
        : 'Vous pouvez maintenant vous connecter',
      variant: 'default',
    })

    router.push('/mes-taches')
  } catch (err) {
    console.error('Auth error:', err)
    error.value = "Une erreur s'est produite. Veuillez réessayer."
  } finally {
    loading.value = false
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<style scoped></style>