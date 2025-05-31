<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { useAuthModal } from '@/features/auth/api/useAuthModal';
import LoginForm from "@/features/auth/ui/LoginForm.vue";

const { isAuthModalOpen, closeAuthModal } = useAuthModal();

const email = ref('');
const password = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;
  try {
    console.log('Login:', { email: email.value, password: password.value });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    closeAuthModal();
    
    email.value = '';
    password.value = '';
  } catch (error) {
    console.error('Login failed:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleBackdropClick = (event) => {
  if (event.target === event.currentTarget) {
    closeAuthModal();
  }
};

const handleEscapeKey = (event) => {
  if (event.key === 'Escape' && isAuthModalOpen.value) {
    closeAuthModal();
  }
};

watch(isAuthModalOpen, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
    email.value = '';
    password.value = '';
  }
});

onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey);
  document.body.style.overflow = '';
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isAuthModalOpen"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[1000]"
        @click="handleBackdropClick"
      >
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="isAuthModalOpen"
            class="bg-black border border-gray-800 rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden"
            @click.stop
          >
            <div class="flex min-h-[500px]">
              <div class="flex-1 bg-gradient-to-br from-gray-900 to-black p-8 flex flex-col justify-center relative overflow-hidden">
                <div class="absolute inset-0 opacity-10">
                  <div class="absolute top-10 left-10 w-32 h-32 bg-green-500 rounded-full blur-3xl"></div>
                  <div class="absolute bottom-10 right-10 w-24 h-24 bg-green-400 rounded-full blur-2xl"></div>
                </div>

                <div class="relative z-10">
                  <div class="mb-8">
                    <div class="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mb-6">
                      <svg class="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 1l3.09 6.26L22 9l-5 4.87L18.18 21 12 17.27 5.82 21 7 13.87 2 9l6.91-1.74L12 1z"/>
                      </svg>
                    </div>
                    <h2 class="text-3xl font-bold text-white mb-4">
                      Безопасное хранилище
                    </h2>
                    <p class="text-gray-300 text-lg leading-relaxed">
                      Ваши данные защищены современными методами шифрования. Мы гарантируем полную конфиденциальность и безопасность вашей информации.
                    </p>
                  </div>

                  <div class="space-y-4">
                    <div class="flex items-center space-x-3">
                      <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span class="text-gray-300">End-to-end шифрование</span>
                    </div>
                    <div class="flex items-center space-x-3">
                      <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span class="text-gray-300">Двухфакторная аутентификация</span>
                    </div>
                    <div class="flex items-center space-x-3">
                      <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span class="text-gray-300">Регулярные аудиты безопасности</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex-1 bg-black p-8 flex flex-col justify-center">
                  <LoginForm/>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
