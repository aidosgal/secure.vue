<script setup>
import { ref, computed } from 'vue';
import {
    FolderIcon,
    DocumentIcon,
    PhotoIcon,
    FilmIcon,
    MusicalNoteIcon,
    DocumentTextIcon,
    ArchiveBoxIcon,
    CloudArrowUpIcon,
    MagnifyingGlassIcon,
    EllipsisVerticalIcon,
    TrashIcon,
    ShareIcon,
    ArrowDownTrayIcon,
    EyeIcon,
    PlusIcon,
    XMarkIcon
} from '@heroicons/vue/24/outline';

const files = ref([
    { id: 1, name: 'contracts.pdf', type: 'pdf', size: '2.4 MB', modified: '2 часа назад', icon: 'DocumentTextIcon' },
    { id: 2, name: 'presentation.pptx', type: 'presentation', size: '5.1 MB', modified: '1 день назад', icon: 'DocumentIcon' },
    { id: 3, name: 'vacation-photos', type: 'folder', size: '24 файла', modified: '3 дня назад', icon: 'FolderIcon' },
    { id: 4, name: 'budget-2024.xlsx', type: 'spreadsheet', size: '890 KB', modified: '5 дней назад', icon: 'DocumentIcon' },
    { id: 5, name: 'meeting-recording.mp4', type: 'video', size: '127 MB', modified: '1 неделя назад', icon: 'FilmIcon' },
    { id: 6, name: 'profile-photo.jpg', type: 'image', size: '1.2 MB', modified: '2 недели назад', icon: 'PhotoIcon' },
    { id: 7, name: 'backup-files.zip', type: 'archive', size: '45 MB', modified: '3 недели назад', icon: 'ArchiveBoxIcon' },
    { id: 8, name: 'music-playlist.mp3', type: 'audio', size: '8.5 MB', modified: '1 месяц назад', icon: 'MusicalNoteIcon' }
]);

const searchTerm = ref('');
const selectedFiles = ref([]);
const showUploadModal = ref(false);
const viewMode = ref('grid');

const storageStats = ref({
    used: 234,
    total: 1000,
    percentage: 23.4
});

const recentActivity = ref([
    { action: 'Загружен файл', item: 'contracts.pdf', time: '2 часа назад' },
    { action: 'Удален файл', item: 'old-document.doc', time: '1 день назад' },
    { action: 'Создана папка', item: 'Project Files', time: '2 дня назад' },
    { action: 'Переименован файл', item: 'budget-2024.xlsx', time: '5 дней назад' }
]);

const filteredFiles = computed(() => {
    return files.value.filter(file =>
        file.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
});

const handleFileSelect = (fileId) => {
    const index = selectedFiles.value.indexOf(fileId);
    if (index > -1) {
        selectedFiles.value.splice(index, 1);
    } else {
        selectedFiles.value.push(fileId);
    }
};

const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    uploadedFiles.forEach(file => {
        const newFile = {
            id: Date.now() + Math.random(),
            name: file.name,
            type: getFileType(file.name),
            size: formatFileSize(file.size),
            modified: 'только что',
            icon: getFileIcon(file.name)
        };
        files.value.unshift(newFile);
    });
    showUploadModal.value = false;
};

const getFileType = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    const typeMap = {
        'pdf': 'pdf',
        'doc': 'document', 'docx': 'document',
        'xls': 'spreadsheet', 'xlsx': 'spreadsheet',
        'ppt': 'presentation', 'pptx': 'presentation',
        'jpg': 'image', 'jpeg': 'image', 'png': 'image', 'gif': 'image',
        'mp4': 'video', 'avi': 'video', 'mov': 'video',
        'mp3': 'audio', 'wav': 'audio',
        'zip': 'archive', 'rar': 'archive', '7z': 'archive'
    };
    return typeMap[extension] || 'document';
};

const getFileIcon = (fileName) => {
    const type = getFileType(fileName);
    const iconMap = {
        'pdf': 'DocumentTextIcon',
        'document': 'DocumentIcon',
        'spreadsheet': 'DocumentIcon',
        'presentation': 'DocumentIcon',
        'image': 'PhotoIcon',
        'video': 'FilmIcon',
        'audio': 'MusicalNoteIcon',
        'archive': 'ArchiveBoxIcon',
        'folder': 'FolderIcon'
    };
    return iconMap[type] || 'DocumentIcon';
};

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const deleteSelectedFiles = () => {
    files.value = files.value.filter(file => !selectedFiles.value.includes(file.id));
    selectedFiles.value = [];
};

const getIconComponent = (iconName) => {
    const iconMap = {
        'DocumentTextIcon': DocumentTextIcon,
        'DocumentIcon': DocumentIcon,
        'PhotoIcon': PhotoIcon,
        'FilmIcon': FilmIcon,
        'MusicalNoteIcon': MusicalNoteIcon,
        'ArchiveBoxIcon': ArchiveBoxIcon,
        'FolderIcon': FolderIcon
    };
    return iconMap[iconName] || DocumentIcon;
};
</script>

<template>
    <div class="min-h-screen text-white p-6">
        <div class="mx-auto">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold mb-2">Мои файлы</h1>
                    <p class="text-[#6a6a6b]">Управляйте своими документами и файлами</p>
                </div>
                <button
                    @click="showUploadModal = true"
                    class="flex items-center px-4 py-2 bg-[#2af16b] text-black rounded-lg hover:bg-[#2af16b]/80 transition"
                >
                    <PlusIcon class="w-5 h-5 mr-2" />
                    Загрузить файл
                </button>
            </div>

            <div class="mt-10">
                <!-- Main Content -->
                <div class="">
                    <!-- Search and Controls -->
                    <div class="flex items-center justify-between">
                        <div class="relative flex-1">
                            <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6a6a6b]" />
                            <input
                                type="text"
                                placeholder="Поиск файлов..."
                                v-model="searchTerm"
                                class="w-full pl-10 pr-4 py-2 bg-[#1e1e20] border border-gray-600 rounded-lg focus:outline-none focus:border-[#2af16b] text-white"
                            />
                        </div>
                        
                        <div v-if="selectedFiles.length > 0" class="flex items-center space-x-2">
                            <span class="text-sm text-[#6a6a6b]">{{ selectedFiles.length }} выбрано</span>
                            <button
                                @click="deleteSelectedFiles"
                                class="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition"
                            >
                                <TrashIcon class="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <!-- Files Grid -->
                    <div class="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        <div
                            v-for="file in filteredFiles"
                            :key="file.id"
                            @click="handleFileSelect(file.id)"
                            :class="[
                                'relative p-4 rounded-lg border transition cursor-pointer',
                                selectedFiles.includes(file.id) 
                                    ? 'border-[#2af16b] bg-[#2af16b]/10' 
                                    : 'border-gray-600 bg-[#1e1e20] hover:border-[#2af16b]/50'
                            ]"
                        >
                            <div class="flex flex-col items-center text-center">
                                <component 
                                    :is="getIconComponent(file.icon)"
                                    :class="[
                                        'w-12 h-12 mb-3',
                                        file.type === 'folder' ? 'text-[#2af16b]' : 'text-[#6a6a6b]'
                                    ]"
                                />
                                <h3 class="font-medium text-sm mb-1 truncate w-full">{{ file.name }}</h3>
                                <p class="text-xs text-[#6a6a6b] mb-1">{{ file.size }}</p>
                                <p class="text-xs text-[#6a6a6b]">{{ file.modified }}</p>
                            </div>
                            
                            <div class="absolute top-2 right-2">
                                <button class="p-1 text-[#6a6a6b] hover:text-white transition">
                                    <EllipsisVerticalIcon class="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div v-if="filteredFiles.length === 0" class="text-center py-12">
                        <DocumentIcon class="w-16 h-16 text-[#6a6a6b] mx-auto mb-4" />
                        <h3 class="text-lg font-medium mb-2">Файлы не найдены</h3>
                        <p class="text-[#6a6a6b]">Попробуйте изменить условия поиска</p>
                    </div>
                </div>
            </div>

            <!-- Upload Modal -->
            <div v-if="showUploadModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div class="bg-[#1e1e20] rounded-lg p-6 w-full max-w-md">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-medium">Загрузить файлы</h3>
                        <button
                            @click="showUploadModal = false"
                            class="text-[#6a6a6b] hover:text-white transition"
                        >
                            <XMarkIcon class="w-6 h-6" />
                        </button>
                    </div>
                    
                    <div 
                        class="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-[#2af16b] transition cursor-pointer"
                        @click="$refs.fileInput.click()"
                    >
                        <CloudArrowUpIcon class="w-12 h-12 text-[#6a6a6b] mx-auto mb-4" />
                        <p class="text-sm text-[#6a6a6b] mb-2">
                            Нажмите для выбора файлов или перетащите их сюда
                        </p>
                        <p class="text-xs text-[#6a6a6b]">
                            Поддерживаются все типы файлов
                        </p>
                    </div>
                    
                    <input
                        ref="fileInput"
                        type="file"
                        multiple
                        @change="handleFileUpload"
                        class="hidden"
                    />
                    
                    <div class="flex space-x-3 mt-6">
                        <button
                            @click="showUploadModal = false"
                            class="flex-1 px-4 py-2 border border-gray-600 text-[#6a6a6b] rounded-lg hover:border-[#2af16b] hover:text-[#2af16b] transition"
                        >
                            Отмена
                        </button>
                        <button
                            @click="$refs.fileInput.click()"
                            class="flex-1 px-4 py-2 bg-[#2af16b] text-black rounded-lg hover:bg-[#2af16b]/80 transition"
                        >
                            Выбрать файлы
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
