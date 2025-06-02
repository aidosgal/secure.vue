<script setup lang="ts">
import { ref } from 'vue';
import { login } from "@/features/auth/api/auth";
import { LoginRequest } from "@/features/auth/model/types";

interface Props {
  closeAuthModal: () => void;
  switchToRegister: () => void;
}

const props = defineProps<Props>();

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);

async function handleLogin() {
  errorMessage.value = null;
  
  const credentials: LoginRequest = {
    email: email.value,
    password: password.value,
  };

  isLoading.value = true;

  try {
    const auth = await login(credentials);
    console.log("Logged in:", auth.user);
    localStorage.setItem('token', auth.token);
    // Close modal on successful login
    props.closeAuthModal();
  } catch (err) {
    console.error(err);
    errorMessage.value = "Неверный email или пароль.";
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="max-w-sm mx-auto w-full">
    <div class="mb-8">
      <h3 class="text-2xl font-bold text-white mb-2">
        Вход в систему
      </h3>
      <p class="text-gray-400">
        Введите ваши данные для входа
      </p>
    </div>

    <!-- Display error message if login fails -->
    <div v-if="errorMessage" class="text-red-500 text-sm mb-4">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="handleLogin" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          Email
        </label>
        <input v-model="email" type="email"
          class="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          placeholder="example@email.com" required :disabled="isLoading" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          Пароль
        </label>
        <input v-model="password" type="password"
          class="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          placeholder="••••••••" required :disabled="isLoading" />
      </div>

      <div class="flex items-center justify-between">
        <label class="flex items-center">
          <input type="checkbox"
            class="w-4 h-4 text-green-500 bg-gray-900 border-gray-700 rounded focus:ring-green-500">
          <span class="ml-2 text-sm text-gray-300">Запомнить меня</span>
        </label>
        <a href="#" class="text-sm text-green-500 hover:text-green-400 transition-colors">
          Забыли пароль?
        </a>
      </div>

      <div class="space-y-3">
        <button type="submit" :disabled="isLoading || !email || !password"
          class="w-full px-4 py-3 text-black bg-green-500 rounded-lg hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium">
          <span v-if="isLoading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
              </circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            Вход...
          </span>
          <span v-else>Войти</span>
        </button>

        <button type="button" @click="props.closeAuthModal" :disabled="isLoading"
          class="w-full px-4 py-3 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 font-medium">
          Отмена
        </button>
      </div>
    </form>

    <div class="mt-6 text-center">
      <p class="text-gray-400 text-sm">
        Нет аккаунта?
        <button @click="props.switchToRegister" class="text-green-500 hover:text-green-400 transition-colors">
          Зарегистрироваться
        </button>
      </p>
    </div>
  </div>
</template>
