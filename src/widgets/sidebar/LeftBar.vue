<script setup>
import { ref } from 'vue';
import {
    HomeIcon,
    DocumentIcon,
    KeyIcon,
    PencilSquareIcon,
    Cog6ToothIcon,
    LockClosedIcon,
    ShieldExclamationIcon,
    UserIcon,
    AdjustmentsHorizontalIcon,
    ShieldCheckIcon,
    QuestionMarkCircleIcon,
    ChatBubbleBottomCenterTextIcon
} from '@heroicons/vue/24/outline';

import {
    HomeIcon as HomeSolidIcon,
    DocumentTextIcon,
    KeyIcon as KeySolidIcon,
    PencilSquareIcon as PencilSolidIcon,
    Cog6ToothIcon as CogSolidIcon,
    LockClosedIcon as LockSolidIcon,
    ShieldExclamationIcon as ShieldExclamationSolidIcon,
    UserIcon as UserSolidIcon,
    AdjustmentsHorizontalIcon as AdjustmentsSolidIcon,
    ShieldCheckIcon as ShieldCheckSolidIcon,
    QuestionMarkCircleIcon as QuestionSolidIcon,
    ChatBubbleBottomCenterTextIcon as ChatSolidIcon
} from '@heroicons/vue/24/solid';

const activeRoute = ref('/');

const links = [
    {
        group: "Главная",
        items: [
            { name: "Главная", route: "/", outlineIcon: HomeIcon, solidIcon: HomeSolidIcon },
        ],
    },
    {
        group: "Хранилище",
        items: [
            { name: "Файлы", route: "/storage/files", outlineIcon: DocumentIcon, solidIcon: DocumentTextIcon },
            { name: "Пароли", route: "/storage/passwords", outlineIcon: KeyIcon, solidIcon: KeySolidIcon },
            { name: "Заметки", route: "/storage/notes", outlineIcon: PencilSquareIcon, solidIcon: PencilSolidIcon },
        ],
    },
    {
        group: "Инструменты",
        items: [
            { name: "Генератор паролей", route: "/tools/password-generator", outlineIcon: Cog6ToothIcon, solidIcon: CogSolidIcon },
            { name: "Шифрование", route: "/tools/encryption", outlineIcon: LockClosedIcon, solidIcon: LockSolidIcon },
            { name: "Проверка утечек", route: "/tools/leak-check", outlineIcon: ShieldExclamationIcon, solidIcon: ShieldExclamationSolidIcon },
        ],
    },
    {
        group: "Аккаунт",
        items: [
            { name: "Профиль", route: "/account/profile", outlineIcon: UserIcon, solidIcon: UserSolidIcon },
            { name: "Настройки", route: "/account/settings", outlineIcon: AdjustmentsHorizontalIcon, solidIcon: AdjustmentsSolidIcon },
        ],
    },
    {
        group: "Помощь",
        items: [
            { name: "Частые вопросы", route: "/help/faq", outlineIcon: QuestionMarkCircleIcon, solidIcon: QuestionSolidIcon },
            { name: "Документация", route: "/docs", outlineIcon: DocumentIcon, solidIcon: DocumentIcon },
        ],
    },
];

const setActiveRoute = (route) => {
    activeRoute.value = route;
};
</script>
<template>
    <div class="py-5">
        <div v-for="section in links" :key="section.group" class="mb-6">
            <h2 class="text-sm mb-1 tracking-wider text-[#6a6a6b]">
                {{ section.group }}
            </h2>
            <ul>
                <li v-for="item in section.items" :key="item.name">
                    <RouterLink :to="item.route"
                        class="flex items-center w-full px-3 py-2 text-[15px] transition mb-1 rounded-lg"
                        :class="activeRoute === item.route ? 'border border-[#2af16b] text-[#2af16b]' : 'hover:text-[#2af16b] text-[#6a6a6b]'"
                        @click="setActiveRoute(item.route)">
                        <component :is="activeRoute === item.route ? item.solidIcon : item.outlineIcon"
                            class="w-5 h-5 mr-4" />
                        <span>{{ item.name }}</span>
                    </RouterLink>
                </li>
            </ul>
        </div>
    </div>
</template>
