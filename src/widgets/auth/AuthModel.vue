<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { useAuthModal } from '@/features/auth/api/useAuthModal';
import LoginForm from "@/features/auth/ui/LoginForm.vue";
import RegisterForm from "@/features/auth/ui/RegisterForm.vue";
import AboutCompany from "../about/AboutCompany.vue";

const { isAuthModalOpen, closeAuthModal } = useAuthModal();

const isLogin = ref(true);

const switchToRegister = () => {
    isLogin.value = false;
};

const switchToLogin = () => {
    isLogin.value = true;
};

const isLoading = ref(false);

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
        <Transition enter-active-class="transition-opacity duration-300" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition-opacity duration-300"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="isAuthModalOpen"
                class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[1000]"
                @click="handleBackdropClick">
                <Transition enter-active-class="transition-all duration-300"
                    enter-from-class="opacity-0 scale-95 translate-y-4"
                    enter-to-class="opacity-100 scale-100 translate-y-0"
                    leave-active-class="transition-all duration-200"
                    leave-from-class="opacity-100 scale-100 translate-y-0"
                    leave-to-class="opacity-0 scale-95 translate-y-4">
                    <div v-if="isAuthModalOpen"
                        class="bg-black border border-gray-800 rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden"
                        @click.stop>
                        <div class="flex min-h-[500px]">
                            <div
                                class="flex-1 bg-gradient-to-br from-gray-900 to-black p-8 flex flex-col justify-center relative overflow-hidden">
                                <div class="absolute inset-0 opacity-10">
                                    <div class="absolute top-10 left-10 w-32 h-32 bg-green-500 rounded-full blur-3xl">
                                    </div>
                                    <div
                                        class="absolute bottom-10 right-10 w-24 h-24 bg-green-400 rounded-full blur-2xl">
                                    </div>
                                </div>
                                <AboutCompany />
                            </div>
                            <div class="flex-1 bg-black p-8 flex flex-col justify-center">
                                <LoginForm 
                                    v-if="isLogin" 
                                    :closeAuthModal="closeAuthModal"
                                    :switchToRegister="switchToRegister"
                                />
                                <RegisterForm 
                                    v-else 
                                    :closeAuthModal="closeAuthModal"
                                    :switchToLogin="switchToLogin"
                                />                            
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>
