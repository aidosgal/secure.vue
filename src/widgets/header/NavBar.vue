<template>
  <div class="flex items-center border-b border-[#6a6a6b]">
    <div class="w-1/3">
      <a href="/" class="block text-green text-lg">
        Secure Storage
      </a>
    </div>

    <div class="w-1/3 flex justify-center">
      <a
        v-for="(link, index) in navLinks"
        :key="index"
        :href="link.href"
        class="hover:bg-[#3a3a3a] text-white text-sm px-5 py-7 whitespace-nowrap"
      >
        {{ link.label }}
      </a>
    </div>

    <div class="w-1/3 flex justify-end">
      <a
        href="/login"
        class="text-sm text-green py-3 px-7 border border-[#2af16b]"
      >
        Начать Пользоваться
      </a>
    </div>
  </div>
</template>

<script setup>
const navLinks = [
  { href: '/', label: 'Про нас' },
  { href: '/docs', label: 'Документация' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/#contacts', label: 'Контакты' },
]
</script>

