<script setup lang="ts">
import { useAuthModal } from '@/features/auth/api/useAuthModal';

const { openAuthModal } = useAuthModal();
const navLinks = [
    { href: '/', label: 'Про нас' },
    { href: '/docs', label: 'Документация' },
    { href: '/help/faq', label: 'FAQ' },
    { href: '/#contacts', label: 'Контакты' },
]

interface Props {
  isLogined: bool;
}

const props = defineProps<Props>();

</script>
<template>
    <div class="flex items-center border-b border-[#6a6a6b]">
        <div class="w-1/3">
            <a href="/" class="block text-green text-lg">
                Secure Storage
            </a>
        </div>

        <div class="w-1/3 flex justify-center">
            <a v-for="(link, index) in navLinks" :key="index" :href="link.href"
                class="hover:bg-[#3a3a3a] text-white text-sm px-5 py-7 whitespace-nowrap">
                {{ link.label }}
            </a>
        </div>

        <div class="w-1/3 flex justify-end">
            <button v-if="!isLogined" @click="openAuthModal" class="text-sm text-green py-3 px-7 border border-[#22af16baf16b]">
                Начать Пользоваться
            </button>
            <a v-if="isLogined" href="/account/profile" class="text-sm text-green py-3 px-7 border border-[#22af16baf16b]">
                Профиль
            </a>
        </div>
    </div>
</template>
