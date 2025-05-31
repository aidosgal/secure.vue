<script setup>
import { ref } from 'vue';
import {
    BellIcon,
    ClockIcon,
    ShieldCheckIcon,
    ChartBarIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XMarkIcon
} from '@heroicons/vue/24/outline';
import {
    BellIcon as BellSolidIcon,
    ClockIcon as ClockSolidIcon,
    ShieldCheckIcon as ShieldSolidIcon,
    ChartBarIcon as ChartSolidIcon,
    ExclamationTriangleIcon as ExclamationSolidIcon,
    CheckCircleIcon as CheckSolidIcon
} from '@heroicons/vue/24/solid';

const recentActivity = ref([
    { action: 'Добавлен новый пароль', item: 'GitHub', time: '10 минут назад' },
    { action: 'Создана заметка', item: 'Важные контакты', time: '1 час назад' },
    { action: 'Загружен файл', item: 'contracts.pdf', time: '2 часа назад' },
    { action: 'Обновлен пароль', item: 'Яндекс', time: '1 день назад' }
]);

const securityStats = ref({
    totalPasswords: 127,
    strongPasswords: 98,
    weakPasswords: 29,
    duplicatePasswords: 12,
    securityScore: 78
});

const dismissNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index > -1) {
        notifications.value.splice(index, 1);
    }
};

const markAsRead = (id) => {
    const notification = notifications.value.find(n => n.id === id);
    if (notification) {
        notification.read = true;
    }
};

const getNotificationIcon = (type) => {
    switch (type) {
        case 'security':
            return ExclamationTriangleIcon;
        case 'success':
            return CheckCircleIcon;
        case 'warning':
            return ExclamationTriangleIcon;
        default:
            return BellIcon;
    }
};

const getNotificationColor = (type) => {
    switch (type) {
        case 'security':
            return 'text-red-400';
        case 'success':
            return 'text-[#2af16b]';
        case 'warning':
            return 'text-yellow-400';
        default:
            return 'text-[#6a6a6b]';
    }
};
</script>

<template>
    <div class="py-5 space-y-6">
        <div class="mb-6">
            <h2 class="text-sm mb-3 tracking-wider text-[#6a6a6b] flex items-center">
                <ShieldCheckIcon class="w-4 h-4 mr-2" />
                Оценка безопасности
            </h2>
            <div class="bg-[#1e1e20] rounded-lg p-4">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-2xl font-bold text-[#2af16b]">{{ securityStats.securityScore }}%</span>
                    <span class="text-sm">Хорошо</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div class="bg-[#2af16b] h-2 rounded-full transition-all duration-300" 
                         :style="`width: ${securityStats.securityScore}%`"></div>
                </div>
                <div class="grid grid-cols-2 gap-2 text-xs">
                    <div class="flex justify-between">
                        <span class="text-[#6a6a6b]">Сильные:</span>
                        <span class="text-[#2af16b]">{{ securityStats.strongPasswords }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-[#6a6a6b]">Слабые:</span>
                        <span class="text-red-400">{{ securityStats.weakPasswords }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="mb-6">
            <h2 class="text-sm mb-3 tracking-wider text-[#6a6a6b] flex items-center">
                <ClockIcon class="w-4 h-4 mr-2" />
                Последние действия
            </h2>
            <div class="space-y-2">
                <div v-for="(activity, index) in recentActivity" :key="index"
                     class="flex items-center space-x-3 p-2 rounded hover:bg-[#2F2F2F] transition">
                    <div class="w-2 h-2 bg-[#2af16b] rounded-full flex-shrink-0"></div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm">
                            {{ activity.action }}
                            <span class="font-medium">{{ activity.item }}</span>
                        </p>
                        <p class="text-xs text-[#6a6a6b]">{{ activity.time }}</p>
                    </div>
                </div>
            </div>
        </div>

<!--         <div class="mb-6">
            <h2 class="text-sm mb-3 tracking-wider text-[#6a6a6b]">
                Быстрые действия
            </h2>
            <div class="space-y-2">
                <button class="w-full px-3 py-2 text-sm bg-[#2af16b] text-black rounded-lg hover:bg-[#2af16b]/80 transition">
                    Добавить пароль
                </button>
                <button class="w-full px-3 py-2 text-sm border border-[#2af16b] text-[#2af16b] rounded-lg hover:bg-[#2af16b]/10 transition">
                    Проверить утечки
                </button>
                <button class="w-full px-3 py-2 text-sm border border-gray-300 text-[#6a6a6b] rounded-lg hover:border-[#2af16b] hover:text-[#2af16b] transition">
                    Создать резервную копию
                </button>
            </div>
        </div> -->
    </div>
</template>
