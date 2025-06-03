<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
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
    Squares2X2Icon,
    ListBulletIcon,
    ArrowPathIcon,
    CreditCardIcon,
    InformationCircleIcon,
    DocumentIcon,
    XMarkIcon
} from '@heroicons/vue/24/outline';
import {
    CheckCircleIcon,
    XCircleIcon,
    ExclamationCircleIcon
} from '@heroicons/vue/24/solid';

// Reactive state
const searchQuery = ref('');
const selectedStorage = ref('STORAGE_LOGIN');
const viewMode = ref('grid');
const showForm = ref(false);
const editingRecord = ref(null);
const visiblePasswords = ref(new Set());
const loading = ref(false);

// API Data
const storageTypes = ref([]);
const currentFields = ref([]);
const records = ref([]);
const formData = ref({});
const selectedRecords = ref(new Set());

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://secure.jumystap.kz/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// API Headers
const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Token ${getToken()}`
});

// Storage type icons mapping
const getStorageIcon = (code) => {
    const iconMap = {
        'STORAGE_LOGIN': KeyIcon,
        'STORAGE_CARD': CreditCardIcon,
        'STORAGE_PERSONAL_INFO': UserIcon,
        'FOLDERS': FolderIcon,
        'STORAGE_FILES': DocumentIcon
    };
    return iconMap[code] || DocumentIcon;
};

// Get field type icon
const getFieldTypeIcon = (type) => {
    const iconMap = {
        'binary': EyeIcon,
        'str': UserIcon,
        'text': DocumentIcon,
        'int': '#123',
        'list': FolderIcon
    };
    return iconMap[type] || DocumentIcon;
};

// API Functions
const fetchStorageTypes = async () => {
    try {
        loading.value = true;
        const response = await fetch(`${API_BASE_URL}/secure-storage/storage/document-abstraction/`, {
            headers: getHeaders()
        });
        
        if (!response.ok) throw new Error('Failed to fetch storage types');
        
        const data = await response.json();
        storageTypes.value = data;
        
        if (data.length > 0 && !selectedStorage.value) {
            selectedStorage.value = data[0].document_code;
        }
    } catch (error) {
        console.error('Error fetching storage types:', error);
    } finally {
        loading.value = false;
    }
};

const fetchFields = async () => {
    if (!selectedStorage.value) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/secure-storage/storage/get-for-post/?code=${selectedStorage.value}`, {
            headers: getHeaders()
        });
        
        if (!response.ok) throw new Error('Failed to fetch fields');
        
        const data = await response.json();
        currentFields.value = data.sort((a, b) => a.index_sort - b.index_sort);
        
        // Initialize form data
        const initialFormData = {};
        data.forEach(field => {
            initialFormData[field.code] = '';
        });
        formData.value = initialFormData;
    } catch (error) {
        console.error('Error fetching fields:', error);
    }
};

const fetchRecords = async () => {
    if (!selectedStorage.value) return;
    
    try {
        loading.value = true;
        const response = await fetch(`${API_BASE_URL}/secure-storage/storage/?code_params=${selectedStorage.value}`, {
            headers: getHeaders()
        });
        
        if (!response.ok) throw new Error('Failed to fetch records');
        
        const data = await response.json();
        records.value = data.results?.body || [];
    } catch (error) {
        console.error('Error fetching records:', error);
        records.value = [];
    } finally {
        loading.value = false;
    }
};

const fetchRecordById = async (recordId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/secure-storage/storage/app/${recordId}/`, {
            headers: getHeaders()
        });
        
        if (!response.ok) throw new Error('Failed to fetch record');
        
        const data = await response.json();
        return data.body || [];
    } catch (error) {
        console.error('Error fetching record:', error);
        return [];
    }
};

const createRecord = async () => {
    try {
        const indicators = currentFields.value.map(field => ({
            code: field.code,
            value: formData.value[field.code] || '',
            type: field.type_value
        }));

        const response = await fetch(`${API_BASE_URL}/secure-storage/storage/app/`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                code: selectedStorage.value,
                indicators
            })
        });

        if (!response.ok) throw new Error('Failed to create record');

        await fetchRecords();
        resetForm();
    } catch (error) {
        console.error('Error creating record:', error);
    }
};

const updateRecord = async () => {
    if (!editingRecord.value) return;

    try {
        const indicators = currentFields.value.map(field => ({
            id: field.id,
            type: field.type_value,
            value: formData.value[field.code] || ''
        }));

        const response = await fetch(`${API_BASE_URL}/secure-storage/storage/app/`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({
                records: [{
                    record_id: editingRecord.value.id,
                    indicators
                }]
            })
        });

        if (!response.ok) throw new Error('Failed to update record');

        await fetchRecords();
        resetForm();
    } catch (error) {
        console.error('Error updating record:', error);
    }
};

const deleteSelectedRecords = async () => {
    if (selectedRecords.value.size === 0) return;

    try {
        const response = await fetch(`${API_BASE_URL}/secure-storage/storage/app/bulk-delete/`, {
            method: 'DELETE',
            headers: getHeaders(),
            body: JSON.stringify({
                record_ids: Array.from(selectedRecords.value)
            })
        });

        if (!response.ok) throw new Error('Failed to delete records');

        await fetchRecords();
        selectedRecords.value.clear();
    } catch (error) {
        console.error('Error deleting records:', error);
    }
};

// Helper functions
const resetForm = () => {
    showForm.value = false;
    editingRecord.value = null;
    const initialFormData = {};
    currentFields.value.forEach(field => {
        initialFormData[field.code] = '';
    });
    formData.value = initialFormData;
};

const startEdit = async (record) => {
    try {
        loading.value = true;
        editingRecord.value = record;
        
        // Fetch the full record data by ID
        const recordData = await fetchRecordById(record.id);
        
        // Initialize form data with empty values first
        const initialFormData = {};
        currentFields.value.forEach(field => {
            initialFormData[field.code] = '';
        });
        
        // Populate form with fetched record data
        recordData.forEach(item => {
            // Map the indicator_code to field code for form population
            const field = currentFields.value.find(f => f.code === item.indicator_code);
            if (field) {
                initialFormData[field.code] = item.value || '';
            }
        });
        
        formData.value = initialFormData;
        showForm.value = true;
    } catch (error) {
        console.error('Error loading record for editing:', error);
    } finally {
        loading.value = false;
    }
};

const togglePasswordVisibility = (recordId, fieldCode) => {
    const key = `${recordId}-${fieldCode}`;
    if (visiblePasswords.value.has(key)) {
        visiblePasswords.value.delete(key);
    } else {
        visiblePasswords.value.add(key);
    }
};

const copyToClipboard = async (text, type) => {
    try {
        await navigator.clipboard.writeText(text);
        console.log(`${type} copied to clipboard`);
        // You could add a toast notification here
    } catch (err) {
        console.error('Copy failed:', err);
    }
};

const getDisplayValue = (record, field) => {
    // Try to get value from record fields if it's a detailed record
    if (record.fields && Array.isArray(record.fields)) {
        const fieldData = record.fields.find(f => f.indicator_code === field.code);
        return fieldData?.value || 'Не задано';
    }
    // Fallback to direct property access
    return record[field.code] || 'Не задано';
};

const toggleRecordSelection = (recordId) => {
    if (selectedRecords.value.has(recordId)) {
        selectedRecords.value.delete(recordId);
    } else {
        selectedRecords.value.add(recordId);
    }
};

// Computed properties
const filteredRecords = computed(() => {
    if (!searchQuery.value) return records.value;
    
    return records.value.filter(record => 
        record.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        record.owner?.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const currentStorageType = computed(() => 
    storageTypes.value.find(storage => storage.document_code === selectedStorage.value)
);

const recordStats = computed(() => ({
    total: records.value.length,
    selected: selectedRecords.value.size
}));

// Watchers
watch(selectedStorage, () => {
    selectedRecords.value.clear();
    fetchFields();
    fetchRecords();
});

// Lifecycle
onMounted(() => {
    fetchStorageTypes();
});

// Form submission
const handleSubmit = () => {
    if (editingRecord.value) {
        updateRecord();
    } else {
        createRecord();
    }
};
</script>
<template>
    <div class="py-5 space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
                <h1 class="text-2xl font-bold mb-2 flex items-center">
                    <component 
                        :is="getStorageIcon(selectedStorage)" 
                        class="w-6 h-6 mr-3 text-[#2af16b]" 
                    />
                    {{ currentStorageType?.document_short_name?.ru || 'Безопасное хранилище' }}
                </h1>
                <p class="text-[#6a6a6b] text-sm">
                    Управляйте всеми вашими данными в одном безопасном месте
                </p>
            </div>
            <div class="flex items-center gap-3">
                <button 
                    v-if="selectedRecords.size > 0"
                    @click="deleteSelectedRecords"
                    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm flex items-center"
                >
                    <TrashIcon class="w-4 h-4 mr-2" />
                    Удалить ({{ selectedRecords.size }})
                </button>
                <button 
                    @click="showForm = true"
                    class="px-4 py-2 bg-[#2af16b] text-black rounded-lg hover:bg-[#2af16b]/80 transition text-sm flex items-center"
                >
                    <PlusIcon class="w-4 h-4 mr-2" />
                    Добавить запись
                </button>
            </div>
        </div>

        <!-- Storage Type Tabs -->
        <div class="flex flex-wrap gap-2 mb-6">
            <button
                v-for="storage in storageTypes"
                :key="storage.document_code"
                @click="selectedStorage = storage.document_code"
                :class="`px-4 py-2 rounded-lg text-sm transition flex items-center ${
                    selectedStorage === storage.document_code 
                        ? 'bg-[#2af16b] text-black' 
                        : 'bg-[#1e1e20] text-[#6a6a6b] hover:text-white hover:bg-[#2F2F2F]'
                }`"
            >
                <component :is="getStorageIcon(storage.document_code)" class="w-4 h-4 mr-2" />
                {{ storage.document_short_name.ru }}
            </button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-[#1e1e20] rounded-lg p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-[#6a6a6b] text-xs mb-1">Всего записей</p>
                        <p class="text-xl font-bold">{{ recordStats.total }}</p>
                    </div>
                    <component :is="getStorageIcon(selectedStorage)" class="w-6 h-6 text-[#2af16b]" />
                </div>
            </div>
            <div class="bg-[#1e1e20] rounded-lg p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-[#6a6a6b] text-xs mb-1">Выбрано</p>
                        <p class="text-xl font-bold text-[#2af16b]">{{ recordStats.selected }}</p>
                    </div>
                    <CheckCircleIcon class="w-6 h-6 text-[#2af16b]" />
                </div>
            </div>
            <div class="bg-[#1e1e20] rounded-lg p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-[#6a6a6b] text-xs mb-1">Поля</p>
                        <p class="text-xl font-bold text-yellow-400">{{ currentFields.length }}</p>
                    </div>
                    <DocumentIcon class="w-6 h-6 text-yellow-400" />
                </div>
            </div>
            <div class="bg-[#1e1e20] rounded-lg p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-[#6a6a6b] text-xs mb-1">Активные</p>
                        <p class="text-xl font-bold text-purple-400">{{ currentFields.filter(f => f.active).length }}</p>
                    </div>
                    <ShieldCheckIcon class="w-6 h-6 text-purple-400" />
                </div>
            </div>
        </div>

        <!-- Filters and Search -->
        <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
                <div class="relative">
                    <MagnifyingGlassIcon class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6a6a6b]" />
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Поиск записей..."
                        class="w-full pl-10 pr-4 py-3 bg-[#1e1e20] border border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:border-[#2af16b] transition"
                    />
                </div>
            </div>
            
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

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
            <ArrowPathIcon class="w-8 h-8 mx-auto mb-4 text-[#2af16b] animate-spin" />
            <p class="text-[#6a6a6b]">Загрузка данных...</p>
        </div>

        <!-- Records Grid View -->
        <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <div 
                v-for="record in filteredRecords" 
                :key="record.id"
                class="bg-[#1e1e20] rounded-lg p-5 hover:bg-[#2F2F2F] transition group relative"
            >
                <!-- Selection checkbox -->
                <div class="absolute top-3 right-3">
                    <input
                        :id="`select-${record.id}`"
                        type="checkbox"
                        :checked="selectedRecords.has(record.id)"
                        @change="toggleRecordSelection(record.id)"
                        class="w-4 h-4 text-[#2af16b] bg-[#0f0f10] border-[#2F2F2F] rounded focus:ring-[#2af16b] focus:ring-2"
                    />
                </div>

                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center flex-1 min-w-0 pr-8">
                        <component :is="getStorageIcon(selectedStorage)" class="w-8 h-8 text-[#2af16b] mr-3 flex-shrink-0" />
                        <div class="min-w-0 flex-1">
                            <h3 class="font-medium truncate">{{ record.name || 'Без названия' }}</h3>
                            <p class="text-sm text-[#6a6a6b] truncate">{{ record.owner }}</p>
                        </div>
                    </div>
                </div>

                <!-- Record Fields Preview -->
                <div class="space-y-2 mb-4">
                    <div 
                        v-for="field in currentFields.slice(0, 3)" 
                        :key="field.id"
                        class="flex items-center text-xs text-[#6a6a6b]"
                    >
                        <component :is="getFieldTypeIcon(field.type_value)" class="w-3 h-3 mr-2" />
                        <span class="font-medium mr-2">{{ field.short_name.ru }}:</span>
                        <span v-if="field.type_value === 'binary'" class="text-[#2af16b]">••••••••</span>
                        <span v-else class="truncate">{{ record[field.code] || 'Не задано' }}</span>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center justify-between pt-3 border-t border-[#2F2F2F]">
                    <span class="text-xs text-[#6a6a6b]">ID: {{ record.id }}</span>
                    <div class="flex items-center gap-2">
                        <button 
                            @click="startEdit(record)"
                            class="p-1.5 hover:bg-[#2F2F2F] rounded transition"
                        >
                            <PencilIcon class="w-4 h-4 text-[#6a6a6b]" />
                        </button>
                        <button 
                            @click="selectedRecords.add(record.id); deleteSelectedRecords()"
                            class="p-1.5 hover:bg-[#2F2F2F] rounded transition"
                        >
                            <TrashIcon class="w-4 h-4 text-red-400" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Records List View -->
        <div v-else-if="!loading" class="space-y-2">
            <div 
                v-for="record in filteredRecords" 
                :key="record.id"
                class="bg-[#1e1e20] rounded-lg p-4 hover:bg-[#2F2F2F] transition"
            >
                <div class="flex items-center justify-between">
                    <div class="flex items-center flex-1 min-w-0">
                        <input
                            :id="`select-list-${record.id}`"
                            type="checkbox"
                            :checked="selectedRecords.has(record.id)"
                            @change="toggleRecordSelection(record.id)"
                            class="w-4 h-4 text-[#2af16b] bg-[#0f0f10] border-[#2F2F2F] rounded focus:ring-[#2af16b] focus:ring-2 mr-3"
                        />
                        <component :is="getStorageIcon(selectedStorage)" class="w-6 h-6 text-[#2af16b] mr-3 flex-shrink-0" />
                        <div class="min-w-0 flex-1">
                            <div class="flex items-center gap-4">
                                <h3 class="font-medium">{{ record.name || 'Без названия' }}</h3>
                                <span class="text-sm text-[#6a6a6b]">{{ record.owner }}</span>
                                <span class="text-xs text-[#6a6a6b]">ID: {{ record.id }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button 
                            @click="startEdit(record)"
                            class="p-2 hover:bg-[#0f0f10] rounded transition"
                        >
                            <PencilIcon class="w-4 h-4 text-[#6a6a6b]" />
                        </button>
                        <button 
                            @click="selectedRecords.add(record.id); deleteSelectedRecords()"
                            class="p-2 hover:bg-[#0f0f10] rounded transition"
                        >
                            <TrashIcon class="w-4 h-4 text-red-400" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && filteredRecords.length === 0" class="text-center py-12">
            <component :is="getStorageIcon(selectedStorage)" class="w-12 h-12 mx-auto mb-4 text-[#6a6a6b]" />
            <h3 class="text-lg font-medium mb-2">
                {{ searchQuery ? 'Записи не найдены' : 'Нет записей' }}
            </h3>
            <p class="text-[#6a6a6b] mb-4">
                {{ searchQuery ? 'Попробуйте изменить поисковый запрос' : 'Добавьте свою первую запись для безопасного хранения' }}
            </p>
            <button
                v-if="!searchQuery"
                @click="showForm = true"
                class="px-4 py-2 bg-[#2af16b] text-black rounded-lg hover:bg-[#2af16b]/80 transition text-sm"
            >
                Добавить запись
            </button>
            <button
                v-else
                @click="searchQuery = ''"
                class="px-4 py-2 bg-[#2af16b] text-black rounded-lg hover:bg-[#2af16b]/80 transition text-sm"
            >
                Показать все записи
            </button>
        </div>

        <!-- Form Modal -->
        <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-[#1e1e20] rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold">
                        {{ editingRecord ? 'Редактировать запись' : 'Добавить запись' }}
                    </h2>
                    <button @click="resetForm" class="p-2 hover:bg-[#2F2F2F] rounded transition">
                        <XMarkIcon class="w-5 h-5" />
                    </button>
                </div>

                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div v-for="field in currentFields" :key="field.id" class="space-y-2">
                        <label :for="field.code" class="block text-sm font-medium">
                            {{ field.short_name.ru }}
                            <span v-if="field.is_required" class="text-red-400">*</span>
                        </label>
                        
                        <!-- String input -->
                        <input
                            v-if="field.type_value === 'str'"
                            :id="field.code"
                            v-model="formData[field.code]"
                            type="text"
                            :required="field.is_required"
                            class="w-full px-3 py-2 bg-[#0f0f10] border border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:border-[#2af16b] transition"
                        />
                        
                        <!-- Password/Binary input -->
                        <div v-else-if="field.type_value === 'binary'" class="relative">
                            <input
                                :id="field.code"
                                v-model="formData[field.code]"
                                :type="visiblePasswords.has(`form-${field.code}`) ? 'text' : 'password'"
                                :required="field.is_required"
                                class="w-full px-3 py-2 pr-10 bg-[#0f0f10] border border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:border-[#2af16b] transition"
                            />
                            <button
                                type="button"
                                @click="togglePasswordVisibility('form', field.code)"
                                class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-[#2F2F2F] rounded transition"
                            >
                                <EyeIcon v-if="!visiblePasswords.has(`form-${field.code}`)" class="w-4 h-4 text-[#6a6a6b]" />
                                <EyeSlashIcon v-else class="w-4 h-4 text-[#6a6a6b]" />
                            </button>
                        </div>
                        
                        <!-- Text area -->
                        <textarea
                            v-else-if="field.type_value === 'text'"
                            :id="field.code"
                            v-model="formData[field.code]"
                            :required="field.is_required"
                            rows="3"
                            class="w-full px-3 py-2 bg-[#0f0f10] border border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:border-[#2af16b] transition resize-vertical"
                        />
                        
                        <!-- Number input -->
                        <input
                            v-else-if="field.type_value === 'int'"
                            :id="field.code"
                            v-model.number="formData[field.code]"
                            type="number"
                            :required="field.is_required"
                            class="w-full px-3 py-2 bg-[#0f0f10] border border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:border-[#2af16b] transition"
                        />
                        
                        <!-- List/Select input -->
                        <select
                            v-else-if="field.type_value === 'list'"
                            :id="field.code"
                            v-model="formData[field.code]"
                            :required="field.is_required"
                            class="w-full px-3 py-2 bg-[#0f0f10] border border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:border-[#2af16b] transition"
                        >
                            <option value="">Выберите значение</option>
                            <!-- You would need to fetch list options based on field.type_extend -->
                        </select>

                        <!-- Field description -->
                        <p v-if="field.description?.ru" class="text-xs text-[#6a6a6b]">
                            {{ field.description.ru }}
                        </p>
                    </div>

                    <div class="flex items-center gap-3 pt-4">
                        <button
                            type="submit"
                            class="flex-1 px-4 py-2 bg-[#2af16b] text-black rounded-lg hover:bg-[#2af16b]/80 transition text-sm font-medium"
                        >
                            {{ editingRecord ? 'Сохранить изменения' : 'Создать запись' }}
                        </button>
                        <button
                            type="button"
                            @click="resetForm"
                            class="px-4 py-2 bg-[#2F2F2F] text-white rounded-lg hover:bg-[#3F3F3F] transition text-sm"
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
