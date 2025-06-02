<script setup lang="ts">
import { ref, computed } from 'vue';
import {
    KeyIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    EyeIcon,
    EyeSlashIcon,
    DocumentDuplicateIcon,
    PencilIcon,
    TrashIcon,
    ExclamationTriangleIcon,
    ShieldCheckIcon,
    ClockIcon,
    GlobeAltIcon,
    UserIcon,
    FolderIcon,
    FilterIcon,
    Squares2X2Icon,
    ListBulletIcon,
    ArrowPathIcon
} from '@heroicons/vue/24/outline';
import {
    CheckCircleIcon,
    XCircleIcon,
    ExclamationCircleIcon
} from '@heroicons/vue/24/solid';

const searchQuery = ref('');
const selectedFolder = ref('all');
const viewMode = ref('grid'); // 'grid' or 'list'
const showPasswordForm = ref(false);
const visiblePasswords = ref(new Set());

const folders = ref([
    { id: 'all', name: 'Все пароли', count: 24, icon: KeyIcon },
    { id: 'work', name: 'Рабочие', count: 8, icon: UserIcon },
    { id: 'personal', name: 'Личные', count: 12, icon: GlobeAltIcon },
    { id: 'social', name: 'Социальные сети', count: 4, icon: Squares2X2Icon }
]);

const passwords = ref([
    {
        id: 1,
        title: 'Gmail',
        username: 'user@gmail.com',
        password: 'SecurePass123!',
        url: 'https://gmail.com',
        folder: 'personal',
        strength: 'strong',
        lastUsed: '2 часа назад',
        created: '15 января 2025',
        favorite: true,
        notes: 'Основной email аккаунт'
    },
    {
        id: 2,
        title: 'GitHub',
        username: 'developer',
        password: 'GitHubPass456@',
        url: 'https://github.com',
        folder: 'work',
        strength: 'strong',
        lastUsed: '1 день назад',
        created: '10 января 2025',
        favorite: false,
        notes: 'Рабочий аккаунт для разработки'
    },
    {
        id: 3,
        title: 'Instagram',
        username: 'myusername',
        password: 'weak123',
        url: 'https://instagram.com',
        folder: 'social',
        strength: 'weak',
        lastUsed: '3 дня назад',
        created: '5 января 2025',
        favorite: false,
        notes: ''
    },
    {
        id: 4,
        title: 'Bank Account',
        username: 'client123',
        password: 'BankSecure789#',
        url: 'https://sberbank.ru',
        folder: 'personal',
        strength: 'strong',
        lastUsed: '1 неделю назад',
        created: '1 января 2025',
        favorite: true,
        notes: 'Основной банковский аккаунт'
    },
    {
        id: 5,
        title: 'Slack Workspace',
        username: 'employee@company.com',
        password: 'SlackPass111',
        url: 'https://company.slack.com',
        folder: 'work',
        strength: 'medium',
        lastUsed: '4 часа назад',
        created: '20 декабря 2024',
        favorite: false,
        notes: 'Корпоративный Slack'
    },
    {
        id: 6,
        title: 'Netflix',
        username: 'viewer@email.com',
        password: 'NetflixStrong456!',
        url: 'https://netflix.com',
        folder: 'personal',
        strength: 'strong',
        lastUsed: '2 дня назад',
        created: '15 декабря 2024',
        favorite: true,
        notes: 'Семейная подписка'
    }
]);

const filteredPasswords = computed(() => {
    let filtered = passwords.value;
    
    // Filter by folder
    if (selectedFolder.value !== 'all') {
        filtered = filtered.filter(p => p.folder === selectedFolder.value);
    }
    
    // Filter by search query
    if (searchQuery.value) {
        filtered = filtered.filter(p => 
            p.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            p.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            p.url.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
    }
    
    return filtered;
});

const passwordStats = computed(() => {
    const total = passwords.value.length;
    const strong = passwords.value.filter(p => p.strength === 'strong').length;
    const medium = passwords.value.filter(p => p.strength === 'medium').length;
    const weak = passwords.value.filter(p => p.strength === 'weak').length;
    
    return { total, strong, medium, weak };
});

const togglePasswordVisibility = (passwordId) => {
    if (visiblePasswords.value.has(passwordId)) {
        visiblePasswords.value.delete(passwordId);
    } else {
        visiblePasswords.value.add(passwordId);
    }
};

const copyToClipboard = async (text, type) => {
    try {
        await navigator.clipboard.writeText(text);
        // In a real app, you'd show a toast notification here
        console.log(`${type} скопирован в буфер обмена`);
    } catch (err) {
        console.error('Ошибка копирования:', err);
    }
};

const getStrengthColor = (strength) => {
    switch (strength) {
        case 'strong': return 'text-[#2af16b]';
        case 'medium': return 'text-yellow-400';
        case 'weak': return 'text-red-400';
        default: return 'text-[#6a6a6b]';
    }
};

const getStrengthIcon = (strength) => {
    switch (strength) {
        case 'strong': return CheckCircleIcon;
        case 'medium': return ExclamationCircleIcon;
        case 'weak': return XCircleIcon;
        default: return ExclamationCircleIcon;
    }
};

const getFaviconUrl = (url) => {
    try {
        const domain = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
        return null;
    }
};
</script>

<template>
    <div class="py-5 space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
                <h1 class="text-2xl font-bold mb-2 flex items-center">
                    <KeyIcon class="w-6 h-6 mr-3 text-[#2af16b]" />
                    Пароли
                </h1>
                <p class="text-[#6a6a6b] text-sm">
                    Управляйте всеми вашими паролями в одном безопасном месте
                </p>
            </div>
            <button 
                @click="showPasswordForm = true"
                class="px-4 py-2 bg-[#2af16b] text-black rounded-lg hover:bg-[#2af16b]/80 transition text-sm flex items-center"
            >
                <PlusIcon class="w-4 h-4 mr-2" />
                Добавить пароль
            </button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-[#1e1e20] rounded-lg p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-[#6a6a6b] text-xs mb-1">Всего</p>
                        <p class="text-xl font-bold">{{ passwordStats.total }}</p>
                    </div>
                    <KeyIcon class="w-6 h-6 text-[#2af16b]" />
                </div>
            </div>
            <div class="bg-[#1e1e20] rounded-lg p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-[#6a6a6b] text-xs mb-1">Надежные</p>
                        <p class="text-xl font-bold text-[#2af16b]">{{ passwordStats.strong }}</p>
                    </div>
                    <CheckCircleIcon class="w-6 h-6 text-[#2af16b]" />
                </div>
            </div>
            <div class="bg-[#1e1e20] rounded-lg p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-[#6a6a6b] text-xs mb-1">Средние</p>
                        <p class="text-xl font-bold text-yellow-400">{{ passwordStats.medium }}</p>
                    </div>
                    <ExclamationCircleIcon class="w-6 h-6 text-yellow-400" />
                </div>
            </div>
            <div class="bg-[#1e1e20] rounded-lg p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-[#6a6a6b] text-xs mb-1">Слабые</p>
                        <p class="text-xl font-bold text-red-400">{{ passwordStats.weak }}</p>
                    </div>
                    <XCircleIcon class="w-6 h-6 text-red-400" />
                </div>
            </div>
        </div>

        <!-- Filters and Search -->
        <div class="flex flex-col sm:flex-row gap-4">
            <!-- Search -->
            <div class="flex-1">
                <div class="relative">
                    <MagnifyingGlassIcon class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6a6a6b]" />
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Поиск паролей..."
                        class="w-full pl-10 pr-4 py-3 bg-[#1e1e20] border border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:border-[#2af16b] transition"
                    />
                </div>
            </div>
            
            <!-- Folder Filter -->
            <div class="flex gap-2">
                <select 
                    v-model="selectedFolder"
                    class="px-4 py-3 bg-[#1e1e20] border border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:border-[#2af16b] transition"
                >
                    <option v-for="folder in folders" :key="folder.id" :value="folder.id">
                        {{ folder.name }} ({{ folder.count }})
                    </option>
                </select>
                
                <!-- View Mode Toggle -->
                <div class="flex bg-[#1e1e20] border border-[#2F2F2F] rounded-lg">
                    <button 
                        @click="viewMode = 'grid'"
                        :class="`px-3 py-3 text-sm transition ${viewMode === 'grid' ? 'bg-[#2af16b] text-black' : 'text-[#6a6a6b] hover:text-white'}`"
                    >
                        <Squares2X2Icon class="w-4 h-4" />
                    </button>
                    <button 
                        @click="viewMode = 'list'"
                        :class="`px-3 py-3 text-sm transition border-l border-[#2F2F2F] ${viewMode === 'list' ? 'bg-[#2af16b] text-black' : 'text-[#6a6a6b] hover:text-white'}`"
                    >
                        <ListBulletIcon class="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Security Alert -->
        <div v-if="passwordStats.weak > 0" class="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div class="flex items-start">
                <ExclamationTriangleIcon class="w-5 h-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                    <h3 class="font-medium text-red-400 mb-1">Обнаружены слабые пароли</h3>
                    <p class="text-sm text-[#6a6a6b] mb-3">
                        У вас {{ passwordStats.weak }} слабых паролей, которые нужно обновить для повышения безопасности.
                    </p>
                    <button class="px-3 py-1.5 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition">
                        Исправить сейчас
                    </button>
                </div>
            </div>
        </div>

        <!-- Passwords Grid/List -->
        <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <div 
                v-for="password in filteredPasswords" 
                :key="password.id"
                class="bg-[#1e1e20] rounded-lg p-5 hover:bg-[#2F2F2F] transition group"
            >
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center flex-1 min-w-0">
                        <img 
                            v-if="getFaviconUrl(password.url)"
                            :src="getFaviconUrl(password.url)"
                            :alt="password.title"
                            class="w-8 h-8 rounded mr-3 flex-shrink-0"
                            @error="$event.target.style.display = 'none'"
                        />
                        <GlobeAltIcon v-else class="w-8 h-8 text-[#6a6a6b] mr-3 flex-shrink-0" />
                        <div class="min-w-0 flex-1">
                            <h3 class="font-medium truncate">{{ password.title }}</h3>
                            <p class="text-sm text-[#6a6a6b] truncate">{{ password.username }}</p>
                        </div>
                    </div>
                    <component 
                        :is="getStrengthIcon(password.strength)"
                        :class="`w-5 h-5 ${getStrengthColor(password.strength)}`"
                    />
                </div>

                <div class="mb-4">
                    <div class="flex items-center bg-[#0f0f10] rounded border border-[#2F2F2F] p-3">
                        <input 
                            :type="visiblePasswords.has(password.id) ? 'text' : 'password'"
                            :value="password.password"
                            readonly
                            class="flex-1 bg-transparent text-sm focus:outline-none"
                        />
                        <div class="flex items-center gap-2 ml-2">
                            <button 
                                @click="togglePasswordVisibility(password.id)"
                                class="p-1 hover:bg-[#2F2F2F] rounded transition"
                            >
                                <EyeIcon v-if="!visiblePasswords.has(password.id)" class="w-4 h-4 text-[#6a6a6b]" />
                                <EyeSlashIcon v-else class="w-4 h-4 text-[#6a6a6b]" />
                            </button>
                            <button 
                                @click="copyToClipboard(password.password, 'Пароль')"
                                class="p-1 hover:bg-[#2F2F2F] rounded transition"
                            >
                                <DocumentDuplicateIcon class="w-4 h-4 text-[#6a6a6b]" />
                            </button>
                        </div>
                    </div>
                </div>

                <div class="space-y-2 mb-4">
                    <div class="flex items-center text-xs text-[#6a6a6b]">
                        <ClockIcon class="w-4 h-4 mr-2" />
                        Использован {{ password.lastUsed }}
                    </div>
                    <div class="flex items-center text-xs">
                        <span class="mr-2">Надежность:</span>
                        <span :class="getStrengthColor(password.strength)">
                            {{ password.strength === 'strong' ? 'Высокая' : password.strength === 'medium' ? 'Средняя' : 'Низкая' }}
                        </span>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center justify-between pt-3 border-t border-[#2F2F2F]">
                    <button 
                        @click="copyToClipboard(password.username, 'Логин')"
                        class="text-xs text-[#6a6a6b] hover:text-[#2af16b] transition"
                    >
                        Копировать логин
                    </button>
                    <div class="flex items-center gap-2">
                        <button class="p-1.5 hover:bg-[#2F2F2F] rounded transition">
                            <PencilIcon class="w-4 h-4 text-[#6a6a6b]" />
                        </button>
                        <button class="p-1.5 hover:bg-[#2F2F2F] rounded transition">
                            <TrashIcon class="w-4 h-4 text-red-400" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="space-y-2">
            <div 
                v-for="password in filteredPasswords" 
                :key="password.id"
                class="bg-[#1e1e20] rounded-lg p-4 hover:bg-[#2F2F2F] transition"
            >
                <div class="flex items-center justify-between">
                    <div class="flex items-center flex-1 min-w-0">
                        <img 
                            v-if="getFaviconUrl(password.url)"
                            :src="getFaviconUrl(password.url)"
                            :alt="password.title"
                            class="w-6 h-6 rounded mr-3 flex-shrink-0"
                            @error="$event.target.style.display = 'none'"
                        />
                        <GlobeAltIcon v-else class="w-6 h-6 text-[#6a6a6b] mr-3 flex-shrink-0" />
                        <div class="min-w-0 flex-1">
                            <div class="flex items-center gap-4">
                                <h3 class="font-medium">{{ password.title }}</h3>
                                <span class="text-sm text-[#6a6a6b]">{{ password.username }}</span>
                                <div class="flex items-center gap-1">
                                    <component 
                                        :is="getStrengthIcon(password.strength)"
                                        :class="`w-4 h-4 ${getStrengthColor(password.strength)}`"
                                    />
                                    <span class="text-xs text-[#6a6a6b]">{{ password.lastUsed }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button 
                            @click="copyToClipboard(password.username, 'Логин')"
                            class="p-2 hover:bg-[#0f0f10] rounded transition"
                        >
                            <UserIcon class="w-4 h-4 text-[#6a6a6b]" />
                        </button>
                        <button 
                            @click="copyToClipboard(password.password, 'Пароль')"
                            class="p-2 hover:bg-[#0f0f10] rounded transition"
                        >
                            <DocumentDuplicateIcon class="w-4 h-4 text-[#6a6a6b]" />
                        </button>
                        <button class="p-2 hover:bg-[#0f0f10] rounded transition">
                            <PencilIcon class="w-4 h-4 text-[#6a6a6b]" />
                        </button>
                        <button class="p-2 hover:bg-[#0f0f10] rounded transition">
                            <TrashIcon class="w-4 h-4 text-red-400" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="filteredPasswords.length === 0" class="text-center py-12">
            <KeyIcon class="w-12 h-12 mx-auto mb-4 text-[#6a6a6b]" />
            <h3 class="text-lg font-medium mb-2">
                {{ searchQuery ? 'Пароли не найдены' : 'Нет паролей' }}
            </h3>
            <p class="text-[#6a6a6b] mb-4">
                {{ searchQuery ? 'Попробуйте изменить поисковый запрос' : 'Добавьте свой первый пароль для безопасного хранения' }}
            </p>
            <button
                v-if="!searchQuery"
                @click="showPasswordForm = true"
                class="px-4 py-2 bg-[#2af16b] text-black rounded-lg hover:bg-[#2af16b]/80 transition text-sm"
            >
                Добавить пароль
            </button>
            <button
                v-else
                @click="searchQuery = ''"
                class="px-4 py-2 bg-[#2af16b] text-black rounded-lg hover:bg-[#2af16b]/80 transition text-sm"
            >
                Показать все пароли
            </button>
        </div>
        <div class="bg-[#1e1e20] rounded-lg p-6">
            <h3 class="font-semibold mb-4 flex items-center">
                <ArrowPathIcon class="w-5 h-5 mr-2 text-[#2af16b]" />
                Быстрые действия
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button class="flex items-center p-3 bg-[#0f0f10] rounded-lg hover:bg-[#2F2F2F] transition text-left">
                    <ShieldCheckIcon class="w-6 h-6 mr-3 text-[#2af16b]" />
                    <div>
                        <p class="font-medium text-sm">Проверить безопасность</p>
                        <p class="text-xs text-[#6a6a6b]">Анализ всех паролей</p>
                    </div>
                </button>
                <button class="flex items-center p-3 bg-[#0f0f10] rounded-lg hover:bg-[#2F2F2F] transition text-left">
                    <ArrowPathIcon class="w-6 h-6 mr-3 text-yellow-400" />
                    <div>
                        <p class="font-medium text-sm">Обновить слабые</p>
                        <p class="text-xs text-[#6a6a6b]">{{ passwordStats.weak }} паролей</p>
                    </div>
                </button>
                <button class="flex items-center p-3 bg-[#0f0f10] rounded-lg hover:bg-[#2F2F2F] transition text-left">
                    <DocumentDuplicateIcon class="w-6 h-6 mr-3 text-purple-400" />
                    <div>
                        <p class="font-medium text-sm">Экспорт паролей</p>
                        <p class="text-xs text-[#6a6a6b]">Резервная копия</p>
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>
