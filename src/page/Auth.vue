<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-white to-primary/5 ">
    <!-- Top Bar -->
    <div class="h-16 bg-white shadow-sm flex items-center px-6">
      <RouterLink to="/" class="font-bold text-xl text-gradient-primary">HabitTracker</RouterLink>
    </div>

    <!-- Main Content -->
    <main class="flex-1 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <Card class="shadow-lg border-t-4 border-primary">
          <CardHeader class="space-y-1 text-center bg-gradient-to-r from-primary/10 to-secondary/10 pb-6">
            <CardTitle class="text-2xl font-bold">
              Connexion
            </CardTitle>
            <p class="text-sm text-gray-600">
              Connectez-vous pour accéder à votre tableau de bord
            </p>
          </CardHeader>

          <CardContent class="pt-6">
            <Alert variant="destructive" class="mb-6">
              <AlertDescription>Une erreur s'est produite. Veuillez réessayer.</AlertDescription>
            </Alert>

            <form class="space-y-4">
              <!-- Nom (visible uniquement en mode inscription normalement) -->
              <div class="space-y-2">
                <Label for="name">Nom</Label>
                <div class="relative">
                  <User class="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input id="name" placeholder="Votre nom" class="pl-10" />
                </div>
              </div>

              <!-- Email -->
              <div class="space-y-2">
                <Label for="email">Email</Label>
                <div class="relative">
                  <Mail class="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input id="email" type="email" placeholder="votre@email.com" class="pl-10" />
                </div>
              </div>

              <!-- Mot de passe -->
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <Label for="password">Mot de passe</Label>
                  <RouterLink to="/reset-password" class="text-xs text-primary hover:underline">
                    Mot de passe oublié?
                  </RouterLink>
                </div>
                <div class="relative">
                  <Lock class="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input id="password" type="password" placeholder="••••••••" class="pl-10 pr-10" />
                  <button type="button" class="absolute right-3 top-3 text-gray-500 hover:text-gray-700">
                    <Eye class="h-4 w-4" />
                  </button>
                </div>
              </div>

              <!-- Se souvenir -->
              <div class="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label for="remember" class="text-sm font-medium leading-none">
                  Se souvenir de moi
                </label>
              </div>

              <!-- Bouton -->
              <Button type="submit" class="w-full bg-gradient-to-r from-primary to-primary/80 hover:opacity-90">
                Se connecter
              </Button>

              <!-- Séparateur -->
              <div class="relative my-4">
                <div class="absolute inset-0 flex items-center">
                  <span class="w-full border-t"></span>
                </div>
                <div class="relative flex justify-center text-xs uppercase">
                  <span class="bg-background px-2 text-muted-foreground">ou continuer avec</span>
                </div>
              </div>

              <!-- Réseaux sociaux -->
              <div class="grid grid-cols-2 gap-4">
                <Button type="button" variant="outline" class="text-gray-800">Google</Button>
                <Button type="button" variant="outline" class="text-gray-800">Facebook</Button>
              </div>
            </form>
          </CardContent>

          <CardFooter class="flex flex-col space-y-4 border-t pt-6 text-center">
            <div class="text-sm">
              Vous n'avez pas de compte?
              <button class="text-primary font-semibold hover:underline">
                S'inscrire
              </button>
            </div>
          </CardFooter>
        </Card>

        <p class="text-center text-gray-500 text-xs mt-4 ">
          En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
        </p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Eye, Lock, Mail, User } from 'lucide-vue-next'

import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardContent from '@/components/ui/CardContent.vue'
import CardFooter from '@/components/ui/CardFooter.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import Alert from '@/components/ui/Alert.vue'
import AlertDescription from '@/components/ui/AlertDescription.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Checkbox from '@/components/ui/Checkbox.vue'
</script>
