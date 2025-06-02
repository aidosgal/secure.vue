<script setup lang="ts">
import { ref, computed } from "vue";
import {
    KeyIcon,
    ClipboardDocumentIcon,
    ArrowPathIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    EyeIcon,
    EyeSlashIcon,
    Cog6ToothIcon,
    PlusIcon,
    XMarkIcon,
} from "@heroicons/vue/24/outline";

const password = ref("");
const showPassword = ref(true);
const copied = ref(false);
const showSettings = ref(false);

const settings = ref({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false,
});

const generatedPasswords = ref([]);

interface Response {
    password: string;
}

async function generatePassword() {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/secure-storage/instruments/create-password/`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
        },
    );

    if (!response.ok) {
        throw new Error(`Profile failed: ${response.statusText}`);
    }

    const data: Response = await response.json();
    password.value = data.password;
    generatedPasswords.value = [
        data.password,
        ...generatedPasswords.value.slice(0, 4),
    ];
}

const calculateStrength = (pwd) => {
    let score = 0;

    if (pwd.length >= 8) score += 25;
    if (pwd.length >= 12) score += 25;
    if (/[a-z]/.test(pwd)) score += 12;
    if (/[A-Z]/.test(pwd)) score += 12;
    if (/[0-9]/.test(pwd)) score += 13;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 13;

    if (score < 30)
        return { level: "Слабый", color: "text-red-400", bg: "bg-red-400" };
    if (score < 60)
        return {
            level: "Средний",
            color: "text-yellow-400",
            bg: "bg-yellow-400",
        };
    if (score < 90)
        return { level: "Хороший", color: "text-blue-400", bg: "bg-blue-400" };
    return { level: "Отличный", color: "text-green-400", bg: "bg-green-400" };
};

const copyToClipboard = async () => {
    try {
        await navigator.clipboard.writeText(password.value);
        copied.value = true;
        setTimeout(() => (copied.value = false), 2000);
    } catch (err) {
        console.error("Failed to copy password");
    }
};

const copyHistoryPassword = async (pwd) => {
    try {
        await navigator.clipboard.writeText(pwd);
    } catch (err) {
        console.error("Failed to copy password");
    }
};

const strength = computed(() => {
    return password.value ? calculateStrength(password.value) : null;
});

const progressWidth = computed(() => {
    if (!password.value) return 0;
    const score = calculateStrength(password.value);
    if (score.level === "Слабый") return 25;
    if (score.level === "Средний") return 50;
    if (score.level === "Хороший") return 75;
    return 100;
});
</script>

<template>
    <div class="min-h-screen text-white p-6">
        <div class="mx-auto max-w-4xl">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold mb-2">Генератор паролей</h1>
                    <p class="text-[#6a6a6b]">
                        Создавайте надежные пароли для защиты ваших аккаунтов
                    </p>
                </div>
                <button
                    @click="showSettings = !showSettings"
                    class="flex items-center px-4 py-2 bg-[#1e1e20] border border-gray-600 text-white rounded-lg hover:border-[#2af16b] transition"
                >
                    <Cog6ToothIcon class="w-5 h-5 mr-2" />
                    Настройки
                </button>
            </div>

            <div class="">
                <!-- Main Generator -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Password Display -->
                    <div
                        class="bg-[#1e1e20] border border-gray-600 rounded-lg p-6"
                    >
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-lg font-medium flex items-center">
                                <KeyIcon class="w-5 h-5 mr-2 text-[#2af16b]" />
                                Сгенерированный пароль
                            </h2>
                            <div class="flex items-center space-x-2">
                                <button
                                    @click="showPassword = !showPassword"
                                    class="p-2 text-[#6a6a6b] hover:text-white transition"
                                >
                                    <EyeSlashIcon
                                        v-if="showPassword"
                                        class="w-5 h-5"
                                    />
                                    <EyeIcon v-else class="w-5 h-5" />
                                </button>
                                <button
                                    @click="copyToClipboard"
                                    class="p-2 text-[#6a6a6b] hover:text-[#2af16b] transition"
                                    :disabled="!password"
                                >
                                    <CheckCircleIcon
                                        v-if="copied"
                                        class="w-5 h-5 text-[#2af16b]"
                                    />
                                    <ClipboardDocumentIcon
                                        v-else
                                        class="w-5 h-5"
                                    />
                                </button>
                            </div>
                        </div>

                        <div class="relative">
                            <input
                                :type="showPassword ? 'text' : 'password'"
                                :value="password"
                                readonly
                                class="w-full p-4 bg-[#0d0d0e] border border-gray-600 rounded-lg text-white font-mono text-lg focus:outline-none focus:border-[#2af16b]"
                                placeholder="Нажмите 'Генерировать' для создания пароля"
                            />
                        </div>

                        <div
                            v-if="strength"
                            class="mt-4 flex items-center justify-between"
                        >
                            <div class="flex items-center space-x-2">
                                <span class="text-sm text-[#6a6a6b]"
                                    >Надежность:</span
                                >
                                <span
                                    :class="`text-sm font-medium ${strength.color}`"
                                    >{{ strength.level }}</span
                                >
                            </div>
                            <div class="flex-1 mx-4">
                                <div
                                    class="w-full bg-gray-600 rounded-full h-2"
                                >
                                    <div
                                        :class="`h-2 rounded-full transition-all duration-300 ${strength.bg}`"
                                        :style="{ width: `${progressWidth}%` }"
                                    ></div>
                                </div>
                            </div>
                            <span class="text-sm text-[#6a6a6b]"
                                >{{ password.length }} симв.</span
                            >
                        </div>

                        <div class="mt-6 flex space-x-3">
                            <button
                                @click="() => generatePassword()"
                                class="flex-1 flex items-center justify-center px-4 py-2 bg-[#2af16b] text-black rounded-lg hover:bg-[#2af16b]/80 transition font-medium"
                            >
                                <ArrowPathIcon class="w-5 h-5 mr-2" />
                                Генерировать
                            </button>
                            <button
                                v-if="password"
                                @click="copyToClipboard"
                                :class="[
                                    'px-6 py-2 border rounded-lg transition',
                                    copied
                                        ? 'border-[#2af16b] text-[#2af16b] bg-[#2af16b]/10'
                                        : 'border-gray-600 text-[#6a6a6b] hover:border-[#2af16b] hover:text-[#2af16b]',
                                ]"
                            >
                                {{ copied ? "Скопировано!" : "Копировать" }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.slider::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #2af16b;
    cursor: pointer;
}

.slider::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #2af16b;
    cursor: pointer;
    border: none;
}
</style>
