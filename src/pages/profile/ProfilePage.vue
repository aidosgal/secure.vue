<script setup lang="ts">
import { ref, onMounted } from "vue";
import { UserIcon, ShieldCheckIcon, BellIcon } from "@heroicons/vue/24/outline";
import { useProfile } from "../../features/auth/api/useProfile";
import type { AuthResponse } from "../../features/auth/model/types";

const activeTab = ref("profile");
const showChangePassword = ref(false);
const isLoading = ref(false);
const passwordLoading = ref(false);

const tabs = [
    { id: "profile", name: "Профиль", icon: UserIcon },
    { id: "security", name: "Безопасность", icon: ShieldCheckIcon },
    { id: "notifications", name: "Уведомления", icon: BellIcon },
];

const isLogined = ref(false);
const data = ref<AuthResponse | null>(null);

// API functions
const updateUserProfile = async (profileData: {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
}) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    if (!token || !userId) {
        throw new Error("Token or user ID not found");
    }

    console.log("Updating profile with:", {
        url: `${import.meta.env.VITE_API_BASE_URL}/secure-storage/user/${userId}/`,
        token: token ? "Token present" : "No token",
        userId,
        data: profileData,
    });

    const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/secure-storage/user/${userId}/`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(profileData),
        },
    );

    console.log("Response status:", response.status);
    console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries()),
    );

    if (!response.ok) {
        const responseText = await response.text();
        console.log("Error response text:", responseText);

        let errorMessage = "Failed to update profile";
        try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
            // If response is not JSON, use the text as error message
            errorMessage =
                responseText ||
                `HTTP ${response.status}: ${response.statusText}`;
        }

        throw new Error(errorMessage);
    }

    const responseText = await response.text();
    console.log("Success response text:", responseText);

    // Handle empty response
    if (!responseText) {
        return { success: true };
    }

    try {
        return JSON.parse(responseText);
    } catch (parseError) {
        console.log("Response is not JSON, treating as success");
        return { success: true, data: responseText };
    }
};

const changeUserPassword = async (passwordData: {
    old_password: string;
    new_password: string;
    confirm_password: string;
}) => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Token not found");
    }

    console.log("Changing password with:", {
        url: `${import.meta.env.VITE_API_BASE_URL}/change-password/`,
        token: token ? "Token present" : "No token",
    });

    const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/change-password/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(passwordData),
        },
    );

    console.log("Password change response status:", response.status);

    if (!response.ok) {
        const responseText = await response.text();
        console.log("Password change error response:", responseText);

        let errorMessage = "Failed to change password";
        try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
            errorMessage =
                responseText ||
                `HTTP ${response.status}: ${response.statusText}`;
        }

        throw new Error(errorMessage);
    }

    const responseText = await response.text();
    console.log("Password change success response:", responseText);

    // Handle empty response
    if (!responseText) {
        return { success: true };
    }

    try {
        return JSON.parse(responseText);
    } catch (parseError) {
        console.log(
            "Password change response is not JSON, treating as success",
        );
        return { success: true, data: responseText };
    }
};

onMounted(async () => {
    try {
        const profile = await useProfile();
        isLogined.value = profile.isLogined.value;
        data.value = profile.data;

        // Update userProfile with actual data
        if (data.value?.user) {
            userProfile.value.first_name = data.value.user.first_name;
            userProfile.value.last_name = data.value.user.last_name;
            userProfile.value.email = data.value.user.email;
            userProfile.value.username = data.value.user.username;
        }

        console.log(data.value?.user.first_name);
    } catch (err) {
        console.error("Failed to load profile:", err);
    }
});

const userProfile = ref({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    avatar: null,
    language: "ru",
    plan: "Premium",
    memberSince: "15 января 2024",
    lastLogin: "2 часа назад",
});

const notifications = ref({
    securityAlerts: true,
    weakPasswords: true,
    billing: true,
    newsletter: false,
    tips: true,
});

const passwordForm = ref({
    current: "",
    new: "",
    confirm: "",
});

const saveProfile = async () => {
    try {
        isLoading.value = true;

        const profileData = {
            first_name: userProfile.value.first_name,
            last_name: userProfile.value.last_name,
            email: userProfile.value.email,
            username: userProfile.value.username,
        };

        await updateUserProfile(profileData);

        // Update local data
        if (data.value?.user) {
            data.value.user.first_name = profileData.first_name;
            data.value.user.last_name = profileData.last_name;
            data.value.user.email = profileData.email;
            data.value.user.username = profileData.username;
        }

        alert("Профиль успешно обновлен!");
        console.log("Профиль сохранен");
    } catch (error) {
        console.error("Failed to save profile:", error);
        alert(`Ошибка при сохранении профиля: ${error.message}`);
    } finally {
        isLoading.value = false;
    }
};

const changePassword = async () => {
    if (passwordForm.value.new !== passwordForm.value.confirm) {
        alert("Пароли не совпадают");
        return;
    }

    if (!passwordForm.value.current || !passwordForm.value.new) {
        alert("Заполните все поля");
        return;
    }

    try {
        passwordLoading.value = true;

        const passwordData = {
            old_password: passwordForm.value.current,
            new_password: passwordForm.value.new,
            confirm_password: passwordForm.value.confirm,
        };

        await changeUserPassword(passwordData);

        alert("Пароль успешно изменен!");
        console.log("Пароль изменен");
        showChangePassword.value = false;
        passwordForm.value = { current: "", new: "", confirm: "" };
    } catch (error) {
        console.error("Failed to change password:", error);
        alert(`Ошибка при изменении пароля: ${error.message}`);
    } finally {
        passwordLoading.value = false;
    }
};
</script>

<template>
    <div class="py-5 space-y-6">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-2xl font-bold mb-2 flex items-center">
                <UserIcon class="w-6 h-6 mr-3 text-[#2af16b]" />
                Профиль
            </h1>
            <p class="text-[#6a6a6b] text-sm">
                Управляйте настройками аккаунта и безопасностью
            </p>
        </div>
        <div class="bg-[#1e1e20] rounded-lg p-6 mb-6">
            <div
                class="flex flex-col sm:flex-row items-start sm:items-center gap-6"
            >
                <div class="flex-1">
                    <h2 class="text-xl font-semibold mb-1">
                        {{
                            `${data?.user.first_name || ""} ${data?.user.last_name || ""}`.trim()
                        }}
                    </h2>
                    <p class="text-[#6a6a6b] mb-2">{{ data?.user.email }}</p>
                    <div class="flex flex-wrap items-center gap-4 text-sm">
                        <span
                            class="px-2 py-1 bg-[#2af16b]/20 text-[#2af16b] rounded text-xs"
                        >
                            {{ userProfile.plan }}
                        </span>
                        <span class="text-[#6a6a6b]">
                            Участник с {{ userProfile.memberSince }}
                        </span>
                        <span class="text-[#6a6a6b]">
                            Последний вход: {{ userProfile.lastLogin }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="border-b border-[#2F2F2F] mb-6">
            <nav class="flex space-x-8 overflow-x-auto">
                <button
                    v-for="tab in tabs"
                    :key="tab.id"
                    @click="activeTab = tab.id"
                    :class="`flex items-center px-1 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                        activeTab === tab.id
                            ? 'border-[#2af16b] text-[#2af16b]'
                            : 'border-transparent text-[#6a6a6b] hover:text-white hover:border-[#6a6a6b]'
                    }`"
                >
                    <component :is="tab.icon" class="w-4 h-4 mr-2" />
                    {{ tab.name }}
                </button>
            </nav>
        </div>

        <div v-if="activeTab === 'profile'" class="space-y-6">
            <div class="bg-[#1e1e20] rounded-lg p-6">
                <h3 class="font-semibold mb-4">Основная информация</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium mb-2"
                            >Имя</label
                        >
                        <input
                            v-model="userProfile.first_name"
                            type="text"
                            :disabled="isLoading"
                            class="w-full px-3 py-2 bg-[#0f0f10] border border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:border-[#2af16b] transition disabled:opacity-50"
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2"
                            >Фамилия</label
                        >
                        <input
                            v-model="userProfile.last_name"
                            type="text"
                            :disabled="isLoading"
                            class="w-full px-3 py-2 bg-[#0f0f10] border border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:border-[#2af16b] transition disabled:opacity-50"
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2"
                            >Email</label
                        >
                        <input
                            v-model="userProfile.email"
                            type="email"
                            :disabled="isLoading"
                            class="w-full px-3 py-2 bg-[#0f0f10] border border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:border-[#2af16b] transition disabled:opacity-50"
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2"
                            >Username</label
                        >
                        <input
                            v-model="userProfile.username"
                            type="text"
                            :disabled="isLoading"
                            class="w-full px-3 py-2 bg-[#0f0f10] border border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:border-[#2af16b] transition disabled:opacity-50"
                        />
                    </div>
                </div>
                <div class="flex justify-end mt-6">
                    <button
                        @click="saveProfile"
                        :disabled="isLoading"
                        class="px-4 py-2 bg-[#2af16b] text-black rounded-lg hover:bg-[#2af16b]/80 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        <span v-if="isLoading" class="mr-2">
                            <svg
                                class="animate-spin h-4 w-4"
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
                        </span>
                        {{
                            isLoading ? "Сохранение..." : "Сохранить изменения"
                        }}
                    </button>
                </div>
            </div>

            <div class="bg-[#1e1e20] rounded-lg p-6">
                <h3 class="font-semibold mb-4">Настройки аккаунта</h3>
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="font-medium">Язык интерфейса</p>
                            <p class="text-sm text-[#6a6a6b]">
                                Выберите предпочитаемый язык
                            </p>
                        </div>
                        <select
                            v-model="userProfile.language"
                            class="px-3 py-2 bg-[#0f0f10] border border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:border-[#2af16b] transition"
                        >
                            <option value="ru">Русский</option>
                            <option value="en">English</option>
                            <option value="uk">Українська</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="activeTab === 'security'" class="space-y-6">
            <div class="bg-[#1e1e20] rounded-lg p-6">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h3 class="font-semibold">Мастер-пароль</h3>
                        <p class="text-sm text-[#6a6a6b]">
                            Последнее изменение: 2 месяца назад
                        </p>
                    </div>
                    <button
                        @click="showChangePassword = true"
                        class="px-4 py-2 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-lg text-sm transition"
                    >
                        Изменить пароль
                    </button>
                </div>

                <!-- Change Password Modal -->
                <div
                    v-if="showChangePassword"
                    class="mt-6 p-4 bg-[#0f0f10] rounded-lg border border-[#2F2F2F]"
                >
                    <h4 class="font-medium mb-4">Изменение пароля</h4>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-2"
                                >Текущий пароль</label
                            >
                            <input
                                v-model="passwordForm.current"
                                type="password"
                                :disabled="passwordLoading"
                                class="w-full px-3 py-2 bg-[#1e1e20] border border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:border-[#2af16b] transition disabled:opacity-50"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2"
                                >Новый пароль</label
                            >
                            <input
                                v-model="passwordForm.new"
                                type="password"
                                :disabled="passwordLoading"
                                class="w-full px-3 py-2 bg-[#1e1e20] border border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:border-[#2af16b] transition disabled:opacity-50"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2"
                                >Подтвердите новый пароль</label
                            >
                            <input
                                v-model="passwordForm.confirm"
                                type="password"
                                :disabled="passwordLoading"
                                class="w-full px-3 py-2 bg-[#1e1e20] border border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:border-[#2af16b] transition disabled:opacity-50"
                            />
                        </div>
                        <div class="flex justify-end space-x-3">
                            <button
                                @click="showChangePassword = false"
                                :disabled="passwordLoading"
                                class="px-4 py-2 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-lg text-sm transition disabled:opacity-50"
                            >
                                Отмена
                            </button>
                            <button
                                @click="changePassword"
                                :disabled="passwordLoading"
                                class="px-4 py-2 bg-[#2af16b] text-black rounded-lg hover:bg-[#2af16b]/80 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                <span v-if="passwordLoading" class="mr-2">
                                    <svg
                                        class="animate-spin h-4 w-4"
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
                                </span>
                                {{
                                    passwordLoading
                                        ? "Изменение..."
                                        : "Изменить пароль"
                                }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="activeTab === 'notifications'" class="space-y-6">
            <div class="bg-[#1e1e20] rounded-lg p-6">
                <h3 class="font-semibold mb-4">Настройки уведомлений</h3>
                <div class="space-y-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="font-medium">Оповещения о безопасности</p>
                            <p class="text-sm text-[#6a6a6b]">
                                Подозрительная активность, новые входы
                            </p>
                        </div>
                        <label
                            class="relative inline-flex items-center cursor-pointer"
                        >
                            <input
                                v-model="notifications.securityAlerts"
                                type="checkbox"
                                class="sr-only peer"
                            />
                            <div
                                class="w-11 h-6 bg-[#2F2F2F] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2af16b]"
                            ></div>
                        </label>
                    </div>
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="font-medium">Слабые пароли</p>
                            <p class="text-sm text-[#6a6a6b]">
                                Уведомления о небезопасных паролях
                            </p>
                        </div>
                        <label
                            class="relative inline-flex items-center cursor-pointer"
                        >
                            <input
                                v-model="notifications.weakPasswords"
                                type="checkbox"
                                class="sr-only peer"
                            />
                            <div
                                class="w-11 h-6 bg-[#2F2F2F] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2af16b]"
                            ></div>
                        </label>
                    </div>
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="font-medium">Платежи и счета</p>
                            <p class="text-sm text-[#6a6a6b]">
                                Информация о списаниях и счетах
                            </p>
                        </div>
                        <label
                            class="relative inline-flex items-center cursor-pointer"
                        >
                            <input
                                v-model="notifications.billing"
                                type="checkbox"
                                class="sr-only peer"
                            />
                            <div
                                class="w-11 h-6 bg-[#2F2F2F] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2af16b]"
                            ></div>
                        </label>
                    </div>
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="font-medium">Советы и рекомендации</p>
                            <p class="text-sm text-[#6a6a6b]">
                                Полезные советы по безопасности
                            </p>
                        </div>
                        <label
                            class="relative inline-flex items-center cursor-pointer"
                        >
                            <input
                                v-model="notifications.tips"
                                type="checkbox"
                                class="sr-only peer"
                            />
                            <div
                                class="w-11 h-6 bg-[#2F2F2F] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2af16b]"
                            ></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
