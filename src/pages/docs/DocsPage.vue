<script setup lang="ts">
import { ref, computed } from 'vue';
import {
    DocumentTextIcon,
    CodeBracketIcon,
    UserIcon,
    ShieldCheckIcon,
    FolderIcon,
    WrenchScrewdriverIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    ClipboardDocumentIcon
} from '@heroicons/vue/24/outline';

const selectedEndpoint = ref(null);
const searchQuery = ref('');
const expandedSections = ref({
    user: true,
    instruments: false,
    storage: false,
    files: false
});

const apiEndpoints = ref({
    user: {
        title: 'Управление пользователями',
        icon: UserIcon,
        color: 'text-blue-400',
        endpoints: [
            {
                id: 'register',
                method: 'POST',
                path: '/api/secure-storage/user/',
                title: 'Регистрация пользователя',
                description: 'Создание нового пользователя в системе',
                headers: [
                    { key: 'Content-Type', value: 'application/json' }
                ],
                body: {
                    user: {
                        username: 'nurzhan123',
                        first_name: 'Нуржан',
                        last_name: 'Серикбеков',
                        email: 'serikbekovnurzhan@gmail.com',
                        password: 'password123',
                        password_confirm: 'password123'
                    }
                },
                response: {
                    success: {
                        id: 1,
                        username: 'nurzhan123',
                        first_name: 'Нуржан',
                        last_name: 'Серикбеков',
                        email: 'serikbekovnurzhan@gmail.com',
                        token: '2b47bac2edab6f0c31032e4b10d355c20ecd32ae'
                    }
                }
            },
            {
                id: 'login',
                method: 'POST',
                path: '/api/api-token-auth/',
                title: 'Авторизация',
                description: 'Получение токена для доступа к API',
                body: {
                    username: 'admin',
                    password: 'admin'
                },
                response: {
                    success: {
                        token: 'b91f590df21df348b347fba7798dec2418339ba1'
                    }
                }
            },
            {
                id: 'getUser',
                method: 'GET',
                path: '/api/secure-storage/user/{id}',
                title: 'Получить пользователя',
                description: 'Получение информации о пользователе по ID',
                headers: [
                    { key: 'Authorization', value: 'Token {your_token}' }
                ],
                parameters: [
                    { name: 'id', type: 'integer', description: 'ID пользователя' }
                ]
            },
            {
                id: 'updateUser',
                method: 'PATCH',
                path: '/api/secure-storage/user/{id}/',
                title: 'Обновить пользователя',
                description: 'Частичное обновление данных пользователя',
                headers: [
                    { key: 'Authorization', value: 'Token {your_token}' },
                    { key: 'Content-Type', value: 'application/json' }
                ],
                body: {
                    first_name: 'Новое имя',
                    username: 'новый_логин',
                    last_name: 'Новая фамилия',
                    email: 'новый@email.com'
                }
            },
            {
                id: 'changePassword',
                method: 'POST',
                path: '/api/change-password/',
                title: 'Смена пароля',
                description: 'Изменение пароля пользователя',
                headers: [
                    { key: 'Authorization', value: 'Token {your_token}' },
                    { key: 'Content-Type', value: 'application/json' }
                ],
                body: {
                    old_password: 'старый_пароль',
                    new_password: 'новый_пароль',
                    confirm_password: 'новый_пароль'
                }
            }
        ]
    },
    instruments: {
        title: 'Инструменты безопасности',
        icon: WrenchScrewdriverIcon,
        color: 'text-[#2af16b]',
        endpoints: [
            {
                id: 'createPassword',
                method: 'GET',
                path: '/api/secure-storage/instruments/create-password/',
                title: 'Генерация пароля',
                description: 'Создание безопасного пароля',
                response: {
                    success: {
                        password: 'aB3$kL9mP2xR7@qW',
                        strength: 'strong',
                        entropy: 72
                    }
                }
            },
            {
                id: 'checkLeak',
                method: 'GET',
                path: '/api/secure-storage/instruments/check-password-leaked/',
                title: 'Проверка утечек',
                description: 'Проверка пароля на наличие в базах утечек',
                headers: [
                    { key: 'Authorization', value: 'Token {your_token}' }
                ],
                parameters: [
                    { name: 'password', type: 'string', description: 'Пароль для проверки' }
                ]
            },
            {
                id: 'discoverInstrument',
                method: 'GET',
                path: '/api/secure-storage/instruments/discover-instrument/',
                title: 'Обнаружение инструментов',
                description: 'Получение доступных инструментов безопасности',
                headers: [
                    { key: 'Authorization', value: 'Token {your_token}' }
                ]
            }
        ]
    },
    storage: {
        title: 'Хранилище данных',
        icon: ShieldCheckIcon,
        color: 'text-purple-400',
        endpoints: [
            {
                id: 'getStorage',
                method: 'GET',
                path: '/api/secure-storage/storage/',
                title: 'Получить хранилище',
                description: 'Получение основной информации о хранилище',
                headers: [
                    { key: 'Authorization', value: 'Token {your_token}' }
                ]
            },
            {
                id: 'createLogin',
                method: 'POST',
                path: '/api/secure-storage/storage/app/',
                title: 'Создать запись входа',
                description: 'Создание новой записи с логином и паролем',
                headers: [
                    { key: 'Authorization', value: 'Token {your_token}' },
                    { key: 'Content-Type', value: 'application/json' }
                ],
                body: {
                    code: 'STORAGE_LOGIN',
                    indicators: [
                        { code: 'STORAGE_LOGIN_TITLE', value: 'Название сайта', type: 'str' },
                        { code: 'STORAGE_LOGIN_LOGNAME', value: 'логин', type: 'str' },
                        { code: 'STORAGE_LOGIN_PASS', value: 'пароль', type: 'binary' },
                        { code: 'STORAGE_LOGIN_TEXT', value: 'дополнительная информация', type: 'text' },
                        { code: 'STORAGE_LOGIN_WEBSITE', value: 'https://example.com', type: 'str' }
                    ]
                }
            },
            {
                id: 'updateLogin',
                method: 'PATCH',
                path: '/api/secure-storage/storage/app/',
                title: 'Обновить запись',
                description: 'Обновление существующей записи',
                headers: [
                    { key: 'Authorization', value: 'Token {your_token}' },
                    { key: 'Content-Type', value: 'application/json' }
                ],
                body: {
                    records: [
                        {
                            record_id: 4,
                            indicators: [
                                { id: 13, type: 'str', value: 'Обновленное название' },
                                { id: 14, type: 'str', value: 'обновленный_логин' },
                                { id: 15, type: 'binary', value: 'новый_пароль' },
                                { id: 16, type: 'str', value: 'обновленный текст' }
                            ]
                        }
                    ]
                }
            },
            {
                id: 'getLogin',
                method: 'GET',    
                path: '/api/secure-storage/storage/app/{id}/',
                title: 'Получить запись',
                description: 'Получение конкретной записи по ID',
                headers: [
                    { key: 'Authorization', value: 'Token {your_token}' }
                ],
                parameters: [
                    { name: 'id', type: 'integer', description: 'ID записи' }
                ]
            },
            {
                id: 'bulkDelete',
                method: 'DELETE',
                path: '/api/secure-storage/storage/app/bulk-delete/',
                title: 'Массовое удаление',
                description: 'Удаление нескольких записей одновременно',
                headers: [
                    { key: 'Authorization', value: 'Token {your_token}' },
                    { key: 'Content-Type', value: 'application/json' }
                ],
                body: {
                    record_ids: [1, 2, 3]
                }
            }
        ]
    },
    files: {
        title: 'Файловое хранилище',
        icon: FolderIcon,
        color: 'text-yellow-400',
        endpoints: [
            {
                id: 'createFile',
                method: 'POST',
                path: '/api/secure-storage/storage/files/',
                title: 'Загрузить файл',
                description: 'Загрузка нового файла в хранилище',
                headers: [
                    { key: 'Authorization', value: 'Token {your_token}' },
                    { key: 'Content-Type', value: 'multipart/form-data' }
                ]
            },
            {
                id: 'getFiles',
                method: 'GET',
                path: '/api/secure-storage/storage/files/',
                title: 'Список файлов',
                description: 'Получение списка всех файлов',
                headers: [
                    { key: 'Authorization', value: 'Token {your_token}' }
                ]
            },
            {
                id: 'getFile',
                method: 'GET',
                path: '/api/secure-storage/storage/files/{id}/',
                title: 'Получить файл',
                description: 'Получение конкретного файла по ID',
                headers: [
                    { key: 'Authorization', value: 'Token {your_token}' }
                ],
                parameters: [
                    { name: 'id', type: 'integer', description: 'ID файла' }
                ]
            },
            {
                id: 'updateFile',
                method: 'PATCH',
                path: '/api/secure-storage/storage/files/{id}/',
                title: 'Обновить файл',
                description: 'Обновление метаданных файла',
                headers: [
                    { key: 'Authorization', value: 'Token {your_token}' },
                    { key: 'Content-Type', value: 'application/json' }
                ]
            },
            {
                id: 'deleteFile',
                method: 'DELETE',
                path: '/api/secure-storage/storage/files/{id}/',
                title: 'Удалить файл',
                description: 'Удаление файла из хранилища',
                headers: [
                    { key: 'Authorization', value: 'Token {your_token}' }
                ]
            }
        ]
    }
});

const filteredEndpoints = computed(() => {
    if (!searchQuery.value) return apiEndpoints.value;
    
    const filtered = {};
    Object.keys(apiEndpoints.value).forEach(key => {
        const section = apiEndpoints.value[key];
        const matchingEndpoints = section.endpoints.filter(endpoint => 
            endpoint.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            endpoint.path.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            endpoint.method.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
        
        if (matchingEndpoints.length > 0) {
            filtered[key] = {
                ...section,
                endpoints: matchingEndpoints
            };
        }
    });
    
    return filtered;
});

const toggleSection = (sectionKey) => {
    expandedSections.value[sectionKey] = !expandedSections.value[sectionKey];
};

const selectEndpoint = (endpoint) => {
    selectedEndpoint.value = endpoint;
};

const getMethodColor = (method) => {
    switch (method) {
        case 'GET': return 'text-green-400 bg-green-400/10';
        case 'POST': return 'text-blue-400 bg-blue-400/10';
        case 'PATCH': return 'text-yellow-400 bg-yellow-400/10';
        case 'DELETE': return 'text-red-400 bg-red-400/10';
        default: return 'text-[#6a6a6b] bg-gray-400/10';
    }
};

const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
};
</script>

<template>
    <div class="py-5 space-y-6">
        <!-- Header -->
        <div class="mb-6">
            <h1 class="text-2xl font-bold mb-2 flex items-center">
                <DocumentTextIcon class="w-6 h-6 mr-3 text-[#2af16b]" />
                API Документация
            </h1>
            <p class="text-[#6a6a6b] text-sm">
                Полное руководство по использованию Secure Storage API
            </p>
        </div>

        <!-- Search -->
        <div class="mb-6">
            <div class="relative">
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Поиск эндпоинтов..."
                    class="w-full px-4 py-2 bg-[#1e1e20] border border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:border-[#2af16b] transition"
                />
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Sidebar -->
            <div class="lg:col-span-1">
                <div class="space-y-4">
                    <div v-for="(section, sectionKey) in filteredEndpoints" :key="sectionKey">
                        <div 
                            @click="toggleSection(sectionKey)"
                            class="flex items-center justify-between p-3 bg-[#1e1e20] rounded-lg cursor-pointer hover:bg-[#2F2F2F] transition"
                        >
                            <div class="flex items-center">
                                <component :is="section.icon" :class="`w-5 h-5 mr-3 ${section.color}`" />
                                <span class="font-medium">{{ section.title }}</span>
                            </div>
                            <ChevronDownIcon 
                                :class="`w-4 h-4 transition-transform ${expandedSections[sectionKey] ? 'rotate-180' : ''}`"
                            />
                        </div>
                        
                        <div v-if="expandedSections[sectionKey]" class="mt-2 space-y-1">
                            <div 
                                v-for="endpoint in section.endpoints" 
                                :key="endpoint.id"
                                @click="selectEndpoint(endpoint)"
                                :class="`flex items-center justify-between p-2 rounded cursor-pointer transition ml-4 ${
                                    selectedEndpoint?.id === endpoint.id 
                                        ? 'bg-[#2af16b]/10 border-l-2 border-[#2af16b]' 
                                        : 'hover:bg-[#2F2F2F]'
                                }`"
                            >
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center mb-1">
                                        <span :class="`text-xs px-2 py-1 rounded font-mono mr-2 ${getMethodColor(endpoint.method)}`">
                                            {{ endpoint.method }}
                                        </span>
                                    </div>
                                    <p class="text-sm font-medium truncate">{{ endpoint.title }}</p>
                                    <p class="text-xs text-[#6a6a6b] font-mono">{{ endpoint.path }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Content -->
            <div class="lg:col-span-2">
                <div v-if="!selectedEndpoint" class="bg-[#1e1e20] rounded-lg p-6 text-center">
                    <CodeBracketIcon class="w-12 h-12 mx-auto mb-4 text-[#6a6a6b]" />
                    <p class="text-[#6a6a6b]">Выберите эндпоинт из списка слева для просмотра документации</p>
                </div>

                <div v-else class="bg-[#1e1e20] rounded-lg p-6">
                    <!-- Endpoint Header -->
                    <div class="mb-6">
                        <div class="flex items-center mb-2">
                            <span :class="`text-sm px-3 py-1 rounded font-mono mr-3 ${getMethodColor(selectedEndpoint.method)}`">
                                {{ selectedEndpoint.method }}
                            </span>
                            <code class="text-[#2af16b] bg-[#2af16b]/10 px-2 py-1 rounded text-sm">
                                {{ selectedEndpoint.path }}
                            </code>
                        </div>
                        <h2 class="text-xl font-bold mb-2">{{ selectedEndpoint.title }}</h2>
                        <p class="text-[#6a6a6b]">{{ selectedEndpoint.description }}</p>
                    </div>

                    <!-- Headers -->
                    <div v-if="selectedEndpoint.headers" class="mb-6">
                        <h3 class="text-sm font-semibold mb-3 text-[#2af16b] flex items-center">
                            <ShieldCheckIcon class="w-4 h-4 mr-2" />
                            Заголовки
                        </h3>
                        <div class="bg-[#0f0f10] rounded-lg p-4">
                            <div v-for="header in selectedEndpoint.headers" :key="header.key" class="mb-2 last:mb-0">
                                <div class="flex items-center justify-between">
                                    <span class="font-mono text-sm text-yellow-400">{{ header.key }}:</span>
                                    <span class="font-mono text-sm">{{ header.value }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Parameters -->
                    <div v-if="selectedEndpoint.parameters" class="mb-6">
                        <h3 class="text-sm font-semibold mb-3 text-[#2af16b]">Параметры</h3>
                        <div class="bg-[#0f0f10] rounded-lg p-4">
                            <div v-for="param in selectedEndpoint.parameters" :key="param.name" class="mb-3 last:mb-0">
                                <div class="flex items-center mb-1">
                                    <span class="font-mono text-sm text-yellow-400 mr-2">{{ param.name }}</span>
                                    <span class="text-xs px-2 py-1 bg-blue-400/10 text-blue-400 rounded">{{ param.type }}</span>
                                </div>
                                <p class="text-xs text-[#6a6a6b]">{{ param.description }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Request Body -->
                    <div v-if="selectedEndpoint.body" class="mb-6">
                        <div class="flex items-center justify-between mb-3">
                            <h3 class="text-sm font-semibold text-[#2af16b]">Тело запроса</h3>
                            <button 
                                @click="copyToClipboard(JSON.stringify(selectedEndpoint.body, null, 2))"
                                class="flex items-center text-xs text-[#6a6a6b] hover:text-[#2af16b] transition"
                            >
                                <ClipboardDocumentIcon class="w-4 h-4 mr-1" />
                                Копировать
                            </button>
                        </div>
                        <div class="bg-[#0f0f10] rounded-lg p-4">
                            <pre class="text-sm font-mono overflow-x-auto"><code>{{ JSON.stringify(selectedEndpoint.body, null, 2) }}</code></pre>
                        </div>
                    </div>

                    <!-- Response -->
                    <div v-if="selectedEndpoint.response" class="mb-6">
                        <h3 class="text-sm font-semibold mb-3 text-[#2af16b]">Пример ответа</h3>
                        <div class="bg-[#0f0f10] rounded-lg p-4">
                            <div class="flex items-center mb-2">
                                <span class="text-xs px-2 py-1 bg-green-400/10 text-green-400 rounded mr-2">200 OK</span>
                            </div>
                            <pre class="text-sm font-mono overflow-x-auto"><code>{{ JSON.stringify(selectedEndpoint.response.success, null, 2) }}</code></pre>
                        </div>
                    </div>

                    <!-- Authentication Note -->
                    <div class="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-4">
                        <div class="flex items-start">
                            <ShieldCheckIcon class="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
                            <div>
                                <p class="text-sm font-medium text-yellow-400 mb-1">Аутентификация</p>
                                <p class="text-xs text-[#6a6a6b]">
                                    Большинство эндпоинтов требуют токен авторизации в заголовке. 
                                    Получите токен через эндпоинт /api/api-token-auth/
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
