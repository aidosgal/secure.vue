<script setup lang="ts">
import { ref } from "vue";
import { register } from "../api/auth";
import type { RegisterRequest } from "../model/types";

interface Props {
    closeAuthModal: () => void;
    switchToLogin: () => void;
}

const props = defineProps<Props>();

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const firstName = ref("");
const lastName = ref("");
const username = ref("");
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);
const isSuccess = ref(false);

async function handleRegister() {
    errorMessage.value = null;

    if (password.value !== confirmPassword.value) {
        errorMessage.value = "Пароли не совпадают";
        return;
    }

    if (password.value.length < 6) {
        errorMessage.value = "Пароль должен содержать минимум 6 символов";
        return;
    }

    const registerData: RegisterRequest = {
        user: {
            email: email.value,
            password: password.value,
            password_confirm: confirmPassword.value,
            first_name: firstName.value,
            last_name: lastName.value,
            username: username.value,
        },
    };

    isLoading.value = true;

    try {
        const response = await register(registerData);
        if (response) {
            isSuccess.value = true;
        }
    } catch (err: any) {
        console.error(err);
        if (err.response?.data?.message) {
            errorMessage.value = err.response.data.message;
        } else if (err.response?.status === 400) {
            errorMessage.value =
                "Неверные данные. Проверьте правильность заполнения полей.";
        } else if (err.response?.status === 409) {
            errorMessage.value =
                "Пользователь с таким email или username уже существует";
        } else {
            errorMessage.value = "Ошибка при регистрации. Попробуйте снова.";
        }
    } finally {
        isLoading.value = false;
    }
}

function handleBackToLogin() {
    isSuccess.value = false;
    props.switchToLogin();
}
</script>

<template>
    <div class="max-w-sm mx-auto w-full">
        <!-- Success Message -->
        <div v-if="isSuccess" class="text-center">
            <div class="mb-6">
                <div
                    class="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center"
                >
                    <svg
                        class="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 13l4 4L19 7"
                        ></path>
                    </svg>
                </div>
                <h3 class="text-2xl font-bold text-white mb-2">
                    Регистрация завершена!
                </h3>
                <p class="text-gray-400 mb-6">
                    Ссылка для подтверждения аккаунта отправлена на ваш email.
                    Проверьте почту и перейдите по ссылке для активации
                    аккаунта.
                </p>
                <div class="space-y-3">
                    <button
                        @click="handleBackToLogin"
                        class="w-full px-4 py-3 text-black bg-green-500 rounded-lg hover:bg-green-400 transition-colors font-medium"
                    >
                        Перейти к входу
                    </button>
                    <button
                        @click="props.closeAuthModal"
                        class="w-full px-4 py-3 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>

        <!-- Registration Form -->
        <div v-else>
            <div class="mb-8">
                <h3 class="text-2xl font-bold text-white mb-2">Регистрация</h3>
                <p class="text-gray-400">Создайте новый аккаунт</p>
            </div>

            <!-- Display error message if registration fails -->
            <div
                v-if="errorMessage"
                class="text-red-500 text-sm mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
            >
                {{ errorMessage }}
            </div>

            <form @submit.prevent="handleRegister" class="space-y-6">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-300 mb-2"
                        >
                            Имя *
                        </label>
                        <input
                            v-model="firstName"
                            type="text"
                            class="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="Имя"
                            required
                            :disabled="isLoading"
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-300 mb-2"
                        >
                            Фамилия *
                        </label>
                        <input
                            v-model="lastName"
                            type="text"
                            class="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="Фамилия"
                            required
                            :disabled="isLoading"
                        />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                        Имя пользователя *
                    </label>
                    <input
                        v-model="username"
                        type="text"
                        class="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="username"
                        required
                        :disabled="isLoading"
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                        Email *
                    </label>
                    <input
                        v-model="email"
                        type="email"
                        class="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="example@email.com"
                        required
                        :disabled="isLoading"
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                        Пароль *
                    </label>
                    <input
                        v-model="password"
                        type="password"
                        class="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="••••••••"
                        required
                        minlength="6"
                        :disabled="isLoading"
                    />
                    <p class="text-xs text-gray-500 mt-1">Минимум 6 символов</p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                        Подтвердите пароль *
                    </label>
                    <input
                        v-model="confirmPassword"
                        type="password"
                        class="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="••••••••"
                        required
                        :disabled="isLoading"
                    />
                </div>

                <div class="flex items-start">
                    <input
                        type="checkbox"
                        id="terms"
                        class="w-4 h-4 text-green-500 bg-gray-900 border-gray-700 rounded focus:ring-green-500 mt-1"
                        required
                    />
                    <label for="terms" class="ml-2 text-sm text-gray-300">
                        Я согласен с
                        <a
                            href="#"
                            class="text-green-500 hover:text-green-400 transition-colors"
                            >условиями использования</a
                        >
                        и
                        <a
                            href="#"
                            class="text-green-500 hover:text-green-400 transition-colors"
                            >политикой конфиденциальности</a
                        >
                    </label>
                </div>

                <div class="space-y-3">
                    <button
                        type="submit"
                        :disabled="
                            isLoading ||
                            !email ||
                            !password ||
                            !confirmPassword ||
                            !firstName ||
                            !lastName ||
                            !username
                        "
                        class="w-full px-4 py-3 text-black bg-green-500 rounded-lg hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        <span
                            v-if="isLoading"
                            class="flex items-center justify-center"
                        >
                            <svg
                                class="animate-spin -ml-1 mr-2 h-5 w-5 text-black"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    class="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    stroke-width="4"
                                ></circle>
                                <path
                                    class="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Регистрация...
                        </span>
                        <span v-else>Зарегистрироваться</span>
                    </button>

                    <button
                        type="button"
                        @click="props.closeAuthModal"
                        :disabled="isLoading"
                        class="w-full px-4 py-3 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 font-medium"
                    >
                        Отмена
                    </button>
                </div>
            </form>

            <div class="mt-6 text-center">
                <p class="text-gray-400 text-sm">
                    Уже есть аккаунт?
                    <button
                        @click="props.switchToLogin"
                        class="text-green-500 hover:text-green-400 transition-colors"
                    >
                        Войти
                    </button>
                </p>
            </div>
        </div>
    </div>
</template>
