<script setup lang="ts">
import { ref, computed } from 'vue';
import {
    UserIcon,
    CogIcon,
    ShieldCheckIcon,
    CreditCardIcon,
    BellIcon,
    DevicePhoneMobileIcon,
    KeyIcon,
    TrashIcon,
    PencilIcon,
    EyeIcon,
    EyeSlashIcon,
    PhotoIcon,
    CheckIcon,
    XMarkIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    GlobeAltIcon,
    LockClosedIcon,
    ArrowRightOnRectangleIcon,
    DocumentDuplicateIcon,
    QrCodeIcon,
    DeviceTabletIcon,
    ComputerDesktopIcon
} from '@heroicons/vue/24/outline';
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    ShieldExclamationIcon
} from '@heroicons/vue/24/solid';

const activeTab = ref('profile');
const showChangePassword = ref(false);
const showDeleteAccount = ref(false);
const show2FASetup = ref(false);
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const tabs = [
    { id: 'profile', name: 'Профиль', icon: UserIcon },
    { id: 'security', name: 'Безопасность', icon: ShieldCheckIcon },
    { id: 'billing', name: 'Оплата', icon: CreditCardIcon },
    { id: 'notifications', name: 'Уведомления', icon: BellIcon },
    { id: 'devices', name: 'Устройства', icon: DevicePhoneMobileIcon }
];

const userProfile = ref({
    name: 'Алексей Петров',
    email: 'alexey.petrov@example.com',
    avatar: null,
    phone: '+7 (999) 123-45-67',
    timezone: 'Europe/Moscow',
    language: 'ru',
    plan: 'Premium',
    memberSince: '15 января 2024',
    lastLogin: '2 часа назад'
});

const securitySettings = ref({
    twoFactorEnabled: true,
    biometricEnabled: false,
    sessionTimeout: 30,
    loginNotifications: true,
    backupCodes: 8
});

const billingInfo = ref({
    plan: 'Premium',
    price: '₽599',
    period: 'месяц',
    nextBilling: '15 июля 2025',
    paymentMethod: '**** 1234',
    autoRenewal: true
});

const notifications = ref({
    securityAlerts: true,
    weakPasswords: true,
    billing: true,
    newsletter: false,
    tips: true
});

const devices = ref([
    {
        id: 1,
        name: 'MacBook Pro',
        type: 'desktop',
        browser: 'Chrome 126.0',
        location: 'Москва, Россия',
        lastActive: 'Сейчас',
        current: true
    },
    {
        id: 2,
        name: 'iPhone 15',
        type: 'mobile',
        browser: 'Safari Mobile',
        location: 'Москва, Россия',
        lastActive: '1 час назад',
        current: false
    },
    {
        id: 3,
        name: 'iPad Air',
        type: 'tablet',
        browser: 'Safari Mobile',
        location: 'Санкт-Петербург, Россия',
        lastActive: '2 дня назад',
        current: false
    }
]);

const passwordForm = ref({
    current: '',
    new: '',
    confirm: ''
});

const getDeviceIcon = (type) => {
    switch (type) {
        case 'mobile': return DevicePhoneMobileIcon;
        case 'tablet': return DeviceTabletIcon;
        case 'desktop': return ComputerDesktopIcon;
        default: return ComputerDesktopIcon;
    }
};

const uploadAvatar = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            userProfile.value.avatar = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

const removeAvatar = () => {
    userProfile.value.avatar = null;
};

const saveProfile = () => {
    // Save profile logic
    console.log('Профиль сохранен');
};

const changePassword = () => {
    if (passwordForm.value.new !== passwordForm.value.confirm) {
        alert('Пароли не совпадают');
        return;
    }
    // Change password logic
    console.log('Пароль изменен');
    showChangePassword.value = false;
    passwordForm.value = { current: '', new: '', confirm: '' };
};

const toggle2FA = () => {
    if (securitySettings.value.twoFactorEnabled) {
        securitySettings.value.twoFactorEnabled = false;
    } else {
        show2FASetup.value = true;
    }
};

const setup2FA = () => {
    securitySettings.value.twoFactorEnabled = true;
    show2FASetup.value = false;
};

const logoutDevice = (deviceId) => {
    devices.value = devices.value.filter(d => d.id !== deviceId);
};

const logoutAllDevices = () => {
    devices.value = devices.value.filter(d => d.current);
};

const cancelSubscription = () => {
    billingInfo.value.autoRenewal = false;
};

const deleteAccount = () => {
    // Delete account logic
    console.log('Аккаунт удален');
    showDeleteAccount.value = false;
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

        <!-- Profile Header -->
        <div class="bg-[#1e1e20] rounded-lg p-6 mb-6">
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div class="relative">
                    <div class="w-20 h-20 rounded-full bg-[#2F2F2F] flex items-center justify-center overflow-hidden">
                        <img v-if="userProfile.avatar" :src="userProfile.avatar" alt="Avatar"
                            class="w-full h-full object-cover" />
                        <UserIcon v-else class="w-10 h-10 text-[#6a6a6b]" />
                    </div>
                    <label
                        class="absolute -bottom-1 -right-1 w-6 h-6 bg-[#2af16b] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#2af16b]/80 transition">
                        <PhotoIcon class="w-3 h-3 text-black" />
                        <input type="file" accept="image/*" @change="uploadAvatar" class="hidden" />
                    </label>
                </div>
                <div class="flex-1">
                    <h2 class="text-xl font-semibold mb-1">{{ userProfile.name }}</h2>
                    <p class="text-[#6a6a6b] mb-2">{{ userProfile.email }}</p>
                    <div class="flex flex-wrap items-center gap-4 text-sm">
                        <span class="px-2 py-1 bg-[#2af16b]/20 text-[#2af16b] rounded text-xs">
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

        <!-- Tabs -->
        <div class="border-b border-[#2F2F2F] mb-6">
            <nav class="flex space-x-8 overflow-x-auto">
                <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="`flex items-center px-1 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${activeTab === tab.id
                        ? 'border-[#2af16b] text-[#2af16b]'
                        : 'border-transparent text-[#6a6a6b] hover:text-white hover:border-[#6a6a6b]'
                    }`">
                    <component :is="tab.icon" class="w-4 h-4 mr-2" />
                    {{ tab.name }}
                </button>
            </nav>
        </div>

        <!-- Profile Tab -->
        <div v-if="activeTab === 'profile'" class="space-y-6">
            <div class="bg-[#1e1e20] rounded-lg p-6">
                <h3 class="font-semibold mb-4">Основная информация</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium mb-2">Имя</label>
                        <input v-model="userProfile.name" type="text"
                            class="w-full px-3 py-2 bg-[#0f0f10] border border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:border-[#2af16b] transition" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Email</label>
                        <input v-model="userProfile.email" type="email"
                            class="w-full px-3 py-2 bg-[#0f0f10] border border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:border-[#2af16b] transition" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Телефон</label>
                        <input v-model="userProfile.phone" type="tel"
                            class="w-full px-3 py-2 bg-[#0f0f10] border border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:border-[#2af16b] transition" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Часовой пояс</label>
                        <select v-model="userProfile.timezone"
                            class="w-full px-3 py-2 bg-[#0f0f10] border border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:border-[#2af16b] transition">
                            <option value="Europe/Moscow">Москва (UTC+3)</option>
                            <option value="Europe/Kiev">Киев (UTC+2)</option>
                            <option value="Asia/Almaty">Алматы (UTC+6)</option>
                        </select>
                    </div>
                </div>
                <div class="flex justify-end mt-6">
                    <button @click="saveProfile"
                        class="px-4 py-2 bg-[#2af16b] text-black rounded-lg hover:bg-[#2af16b]/80 transition text-sm">
                        Сохранить изменения
                    </button>
                </div>
            </div>

            <div class="bg-[#1e1e20] rounded-lg p-6">
                <h3 class="font-semibold mb-4">Настройки аккаунта</h3>
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="font-medium">Язык интерфейса</p>
                            <p class="text-sm text-[#6a6a6b]">Выберите предпочитаемый язык</p>
                        </div>
                        <select v-model="userProfile.language"
                            class="px-3 py-2 bg-[#0f0f10] border border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:border-[#2af16b] transition">
                            <option value="ru">Русский</option>
                            <option value="en">English</option>
                            <option value="uk">Українська</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <!-- Security Tab -->
        <div v-if="activeTab === 'security'" class="space-y-6">
            <!-- Security Overview -->
            <div class="bg-[#1e1e20] rounded-lg p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-semibold">Состояние безопасности</h3>
                    <div class="flex items-center">
                        <CheckCircleIcon class="w-5 h-5 text-[#2af16b] mr-2" />
                        <span class="text-sm text-[#2af16b]">Отлично</span>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-[#0f0f10] rounded-lg p-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-[#6a6a6b]">2FA</p>
                                <p class="font-medium">{{ securitySettings.twoFactorEnabled ? 'Включена' : 'Отключена'
                                    }}</p>
                            </div>
                            <CheckCircleIcon v-if="securitySettings.twoFactorEnabled" class="w-5 h-5 text-[#2af16b]" />
                            <ExclamationCircleIcon v-else class="w-5 h-5 text-yellow-400" />
                        </div>
                    </div>
                    <div class="bg-[#0f0f10] rounded-lg p-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-[#6a6a6b]">Резервные коды</p>
                                <p class="font-medium">{{ securitySettings.backupCodes }} доступно</p>
                            </div>
                            <CheckCircleIcon class="w-5 h-5 text-[#2af16b]" />
                        </div>
                    </div>
                    <div class="bg-[#0f0f10] rounded-lg p-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-[#6a6a6b]">Тайм-аут сессии</p>
                                <p class="font-medium">{{ securitySettings.sessionTimeout }} мин</p>
                            </div>
                            <CheckCircleIcon class="w-5 h-5 text-[#2af16b]" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Password -->
            <div class="bg-[#1e1e20] rounded-lg p-6">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h3 class="font-semibold">Мастер-пароль</h3>
                        <p class="text-sm text-[#6a6a6b]">Последнее изменение: 2 месяца назад</p>
                    </div>
                    <button @click="showChangePassword = true"
                        class="px-4 py-2 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-lg text-sm transition">
                        Изменить пароль
                    </button>
                </div>
            </div>

            <!-- 2FA -->
            <div class="bg-[#1e1e20] rounded-lg p-6">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h3 class="font-semibold">Двухфакторная аутентификация</h3>
                        <p class="text-sm text-[#6a6a6b]">Дополнительная защита вашего аккаунта</p>
                    </div>
                    <button @click="toggle2FA" :class="`px-4 py-2 rounded-lg text-sm transition ${securitySettings.twoFactorEnabled
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                            : 'bg-[#2af16b] text-black hover:bg-[#2af16b]/80'
                        }`">
                        {{ securitySettings.twoFactorEnabled ? 'Отключить 2FA' : 'Включить 2FA' }}
                    </button>
                </div>
                <div v-if="securitySettings.twoFactorEnabled" class="bg-[#0f0f10] rounded-lg p-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <QrCodeIcon class="w-5 h-5 text-[#2af16b] mr-3" />
                            <div>
                                <p class="font-medium text-sm">Authenticator App</p>
                                <p class="text-xs text-[#6a6a6b]">Google Authenticator, Authy</p>
                            </div>
                        </div>
                        <button class="text-xs text-[#2af16b] hover:underline">
                            Показать QR-код
                        </button>
                    </div>
                </div>
            </div>

            <!-- Session Settings -->
            <div class="bg-[#1e1e20] rounded-lg p-6">
                <h3 class="font-semibold mb-4">Настройки сессии</h3>
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="font-medium">Автоматический выход</p>
                            <p class="text-sm text-[#6a6a6b]">Время неактивности до выхода</p>
                        </div>
                        <select v-model="securitySettings.sessionTimeout"
                            class="px-3 py-2 bg-[#0f0f10] border border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:border-[#2af16b] transition">
                            <option :value="15">15 минут</option>
                            <option :value="30">30 минут</option>
                            <option :value="60">1 час</option>
                            <option :value="240">4 часа</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <!-- Billing Tab -->
        <div v-if="activeTab === 'billing'" class="space-y-6">
            <!-- Current Plan -->
            <div class="bg-[#1e1e20] rounded-lg p-6">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h3 class="font-semibold">Текущий тариф</h3>
                        <p class="text-sm text-[#6a6a6b]">{{ billingInfo.plan }} Plan</p>
                    </div>
                    <div class="text-right">
                        <p class="text-2xl font-bold">{{ billingInfo.price }}</p>
                        <p class="text-sm text-[#6a6a6b]">в {{ billingInfo.period }}</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div class="bg-[#0f0f10] rounded-lg p-4">
                        <p class="text-sm text-[#6a6a6b] mb-1">Следующее списание</p>
                        <p class="font-medium">{{ billingInfo.nextBilling }}</p>
                    </div>
                    <div class="bg-[#0f0f10] rounded-lg p-4">
                        <p class="text-sm text-[#6a6a6b] mb-1">Способ оплаты</p>
                        <p class="font-medium">Карта {{ billingInfo.paymentMethod }}</p>
                    </div>
                </div>
                <div class="flex flex-wrap gap-3">
                    <button
                        class="px-4 py-2 bg-[#2af16b] text-black rounded-lg hover:bg-[#2af16b]/80 transition text-sm">
                        Изменить тариф
                    </button>
                    <button class="px-4 py-2 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-lg text-sm transition">
                        Изменить оплату
                    </button>
                    <button @click="cancelSubscription"
                        class="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-sm transition">
                        {{ billingInfo.autoRenewal ? 'Отменить подписку' : 'Подписка отменена' }}
                    </button>
                </div>
            </div>

            <!-- Billing History -->
            <div class="bg-[#1e1e20] rounded-lg p-6">
                <h3 class="font-semibold mb-4">История платежей</h3>
                <div class="space-y-3">
                    <div class="flex items-center justify-between py-3 border-b border-[#2F2F2F] last:border-b-0">
                        <div>
                            <p class="font-medium">Premium Plan</p>
                            <p class="text-sm text-[#6a6a6b]">15 июня 2025</p>
                        </div>
                        <div class="text-right">
                            <p class="font-medium">₽599</p>
                            <button class="text-xs text-[#2af16b] hover:underline">Скачать</button>
                        </div>
                    </div>
                    <div class="flex items-center justify-between py-3 border-b border-[#2F2F2F] last:border-b-0">
                        <div>
                            <p class="font-medium">Premium Plan</p>
                            <p class="text-sm text-[#6a6a6b]">15 мая 2025</p>
                        </div>
                        <div class="text-right">
                            <p class="font-medium">₽599</p>
                            <button class="text-xs text-[#2af16b] hover:underline">Скачать</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Notifications Tab -->
        <div v-if="activeTab === 'notifications'" class="space-y-6">
            <div class="bg-[#1e1e20] rounded-lg p-6">
                <h3 class="font-semibold mb-4">Настройки уведомлений</h3>
                <div class="space-y-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="font-medium">Оповещения о безопасности</p>
                            <p class="text-sm text-[#6a6a6b]">Подозрительная активность, новые входы</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input v-model="notifications.securityAlerts" type="checkbox" class="sr-only peer">
                            <div
                                class="w-11 h-6 bg-[#2F2F2F] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2af16b]">
                            </div>
                        </label>
                    </div>
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="font-medium">Слабые пароли</p>
                            <p class="text-sm text-[#6a6a6b]">Уведомления о небезопасных паролях</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input v-model="notifications.weakPasswords" type="checkbox" class="sr-only peer">
                            <div
                                class="w-11 h-6 bg-[#2F2F2F] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2af16b]">
                            </div>
                        </label>
                    </div>
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="font-medium">Платежи и счета</p>
                            <p class="text-sm text-[#6a6a6b]">Информация о списаниях и счетах</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input v-model="notifications.billing" type="checkbox" class="sr-only peer">
                            <div
                                class="w-11 h-6 bg-[#2F2F2F] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2af16b]">
                            </div>
                        </label>
                    </div>
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="font-medium">Советы и рекомендации</p>
                            <p class="text-sm text-[#6a6a6b]">Полезные советы по безопасности</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input v-model="notifications.tips" type="checkbox" class="sr-only peer">
                            <div
                                class="w-11 h-6 bg-[#2F2F2F] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2af16b]">
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
