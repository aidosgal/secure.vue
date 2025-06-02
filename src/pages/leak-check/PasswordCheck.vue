<template>
    <div class="py-5 space-y-6">
        <!-- Header -->
        <div class="mb-6">
            <h2
                class="text-sm mb-3 tracking-wider text-[#6a6a6b] flex items-center"
            >
                <ShieldCheckIcon class="w-4 h-4 mr-2" />
                Проверка утечек паролей
            </h2>
        </div>

        <!-- Check Options -->
        <div class="bg-[#1e1e20] rounded-lg p-4 mb-6">
            <div class="space-y-4">
                <div>
                    <label class="text-sm text-[#6a6a6b] mb-2 block"
                        >Выберите тип проверки:</label
                    >
                    <div class="flex space-x-2">
                        <button
                            @click="checkType = 'all'"
                            :class="[
                                'px-4 py-2 text-sm rounded-lg transition',
                                checkType === 'all'
                                    ? 'bg-[#2af16b] text-black'
                                    : 'border border-[#2af16b] text-[#2af16b] hover:bg-[#2af16b]/10',
                            ]"
                        >
                            Все пароли
                        </button>
                        <button
                            @click="checkType = 'specific'"
                            :class="[
                                'px-4 py-2 text-sm rounded-lg transition',
                                checkType === 'specific'
                                    ? 'bg-[#2af16b] text-black'
                                    : 'border border-[#2af16b] text-[#2af16b] hover:bg-[#2af16b]/10',
                            ]"
                        >
                            Конкретный пароль
                        </button>
                    </div>
                </div>

                <!-- Specific Password Input -->
                <div v-if="checkType === 'specific'" class="space-y-2">
                    <label class="text-sm text-[#6a6a6b]"
                        >Введите пароль для проверки:</label
                    >
                    <input
                        v-model="specificPassword"
                        type="password"
                        class="w-full px-3 py-2 bg-[#2F2F2F] border border-gray-600 rounded-lg text-white placeholder-[#6a6a6b] focus:border-[#2af16b] focus:outline-none"
                        placeholder="Введите пароль..."
                    />
                </div>

                <!-- Check Button -->
                <button
                    @click="checkPasswords"
                    :disabled="
                        loading ||
                        (checkType === 'specific' && !specificPassword.trim())
                    "
                    class="w-full px-4 py-2 bg-[#2af16b] text-black rounded-lg hover:bg-[#2af16b]/80 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    <span v-if="loading" class="flex items-center">
                        <svg
                            class="animate-spin -ml-1 mr-3 h-4 w-4 text-black"
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
                        Проверка...
                    </span>
                    <span v-else>Проверить утечки</span>
                </button>
            </div>
        </div>

        <!-- Results Section -->
        <div v-if="results.length > 0 || error" class="space-y-4">
            <!-- Error Message -->
            <div
                v-if="error"
                class="bg-red-900/20 border border-red-500/30 rounded-lg p-4"
            >
                <div class="flex items-center">
                    <ExclamationTriangleIcon
                        class="w-5 h-5 text-red-400 mr-2"
                    />
                    <span class="text-red-400 text-sm">{{ error }}</span>
                </div>
            </div>

            <!-- Results Header -->
            <div
                v-if="results.length > 0"
                class="flex items-center justify-between"
            >
                <h3
                    class="text-sm tracking-wider text-[#6a6a6b] flex items-center"
                >
                    <ChartBarIcon class="w-4 h-4 mr-2" />
                    Результаты проверки
                </h3>
                <span class="text-xs text-[#6a6a6b]">
                    Найдено утечек: {{ leakedCount }} из {{ results.length }}
                </span>
            </div>

            <!-- Results List -->
            <div v-if="results.length > 0" class="space-y-2">
                <div
                    v-for="(result, index) in results"
                    :key="index"
                    class="flex items-center space-x-3 p-3 rounded-lg transition"
                    :class="
                        result.leaked_times
                            ? 'bg-red-900/20 border border-red-500/30'
                            : 'bg-[#1e1e20]'
                    "
                >
                    <div class="flex-shrink-0">
                        <ExclamationTriangleIcon
                            v-if="result.leaked_times"
                            class="w-5 h-5 text-red-400"
                        />
                        <CheckCircleIcon
                            v-else
                            class="w-5 h-5 text-[#2af16b]"
                        />
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between">
                            <p class="text-sm font-medium">
                                {{
                                    result.leaked_times
                                        ? "Утечка обнаружена"
                                        : "Пароль безопасен"
                                }}
                            </p>
                            <span
                                v-if="result.leaked_times"
                                class="text-xs text-red-400"
                            >
                                Найдено: {{ result.leaked_times }}
                            </span>
                        </div>
                        <p class="text-xs text-[#6a6a6b] truncate">
                            Пароль: {{ maskPassword(result.password) }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Summary -->
            <div v-if="results.length > 0" class="bg-[#1e1e20] rounded-lg p-4">
                <h4 class="text-sm font-medium mb-2 text-[#6a6a6b]">Сводка</h4>
                <div class="grid grid-cols-2 gap-4 text-xs">
                    <div class="flex justify-between">
                        <span class="text-[#6a6a6b]">Всего проверено:</span>
                        <span class="text-white">{{ results.length }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-[#6a6a6b]">Утечек найдено:</span>
                        <span class="text-red-400">{{ leakedCount }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-[#6a6a6b]">Безопасных:</span>
                        <span class="text-[#2af16b]">{{
                            results.length - leakedCount
                        }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-[#6a6a6b]">Безопасность:</span>
                        <span :class="securityLevel.color">{{
                            securityLevel.text
                        }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div
            v-if="!results.length && !loading && !error"
            class="text-center py-8"
        >
            <ShieldCheckIcon class="w-12 h-12 text-[#6a6a6b] mx-auto mb-4" />
            <p class="text-[#6a6a6b] text-sm">
                Выберите тип проверки и нажмите "Проверить утечки"
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
    ShieldCheckIcon,
    ChartBarIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
} from "@heroicons/vue/24/outline";

const checkType = ref("all");
const specificPassword = ref("");
const loading = ref(false);
const results = ref([]);
const error = ref("");

const leakedCount = computed(() => {
    return results.value.filter((result) => result.leaked_times).length;
});

const securityLevel = computed(() => {
    if (results.value.length === 0)
        return { text: "Не проверено", color: "text-[#6a6a6b]" };

    const ratio = leakedCount.value / results.value.length;

    if (ratio === 0) return { text: "Отлично", color: "text-[#2af16b]" };
    if (ratio <= 0.2) return { text: "Хорошо", color: "text-[#2af16b]" };
    if (ratio <= 0.5)
        return { text: "Удовлетворительно", color: "text-yellow-400" };
    return { text: "Требует внимания", color: "text-red-400" };
});

const maskPassword = (password: string) => {
    if (password.length <= 4) return "*".repeat(password.length);
    return (
        password.slice(0, 2) +
        "*".repeat(password.length - 4) +
        password.slice(-2)
    );
};

const checkPasswords = async () => {
    loading.value = true;
    error.value = "";
    results.value = [];
    const token = localStorage.getItem("token");

    try {
        let url = `${import.meta.env.VITE_API_BASE_URL}/secure-storage/instruments/check-password-leaked/`;

        if (checkType.value === "specific" && specificPassword.value.trim()) {
            url += `?password=${encodeURIComponent(specificPassword.value)}`;
        }

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // Add authorization headers if needed
                Authorization: `Token ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const data = await response.json();
        results.value = Array.isArray(data) ? data : [data];
    } catch (err) {
        error.value = err.message || "Произошла ошибка при проверке паролей";
        console.error("Error checking passwords:", err);
    } finally {
        loading.value = false;
    }
};
</script>
