<script setup lang="ts">
import { ref, computed } from 'vue';
import {
    QuestionMarkCircleIcon,
    ChevronDownIcon,
    ShieldCheckIcon,
    KeyIcon,
    LockClosedIcon,
    UserIcon,
    CogIcon,
    ExclamationTriangleIcon,
    DocumentTextIcon,
    CloudIcon,
    DevicePhoneMobileIcon
} from '@heroicons/vue/24/outline';
import {
    CheckCircleIcon
} from '@heroicons/vue/24/solid';

const searchQuery = ref('');
const expandedItems = ref(new Set());

const faqCategories = ref([
    {
        id: 'security',
        title: 'Безопасность',
        icon: ShieldCheckIcon,
        color: 'text-[#2af16b]',
        questions: [
            {
                id: 'security-1',
                question: 'Насколько безопасно хранение моих паролей?',
                answer: 'Мы используем военный стандарт шифрования AES-256 для защиты ваших данных. Все пароли шифруются локально на вашем устройстве перед отправкой на сервер. Даже мы не можем увидеть ваши незашифрованные данные.'
            },
            {
                id: 'security-2',
                question: 'Что такое двухфакторная аутентификация (2FA)?',
                answer: '2FA добавляет дополнительный уровень безопасности к вашему аккаунту. Помимо пароля, вам потребуется ввести код из мобильного приложения или SMS. Это защищает ваш аккаунт даже если кто-то узнает ваш пароль.'
            },
            {
                id: 'security-3',
                question: 'Как часто нужно менять мастер-пароль?',
                answer: 'Рекомендуется менять мастер-пароль каждые 3-6 месяцев или немедленно, если вы подозреваете его компрометацию. Убедитесь, что новый пароль уникален и не используется в других сервисах.'
            },
            {
                id: 'security-4',
                question: 'Что делать при подозрении на взлом аккаунта?',
                answer: 'Немедленно смените мастер-пароль, включите 2FA если она отключена, проверьте журнал активности на подозрительные входы, и обновите все важные пароли. Свяжитесь с нашей поддержкой для дополнительной помощи.'
            }
        ]
    },
    {
        id: 'passwords',
        title: 'Управление паролями',
        icon: KeyIcon,
        color: 'text-blue-400',
        questions: [
            {
                id: 'passwords-1',
                question: 'Как создать надежный пароль?',
                answer: 'Используйте наш генератор паролей для создания уникальных паролей длиной не менее 12 символов. Включайте заглавные и строчные буквы, цифры и специальные символы. Избегайте личной информации и словарных слов.'
            },
            {
                id: 'passwords-2',
                question: 'Сколько паролей можно хранить?',
                answer: 'В базовом тарифе можно хранить до 100 паролей. Премиум пользователи получают неограниченное хранилище паролей, заметок и файлов.'
            },
            {
                id: 'passwords-3',
                question: 'Как импортировать пароли из другого менеджера?',
                answer: 'Экспортируйте данные из вашего текущего менеджера паролей в формате CSV, затем используйте функцию импорта в настройках. Мы поддерживаем импорт из всех популярных менеджеров паролей.'
            },
            {
                id: 'passwords-4',
                question: 'Что означает "слабый пароль" в отчете безопасности?',
                answer: 'Слабый пароль - это пароль, который легко угадать или взломать. Обычно это короткие пароли, содержащие только буквы, общие слова или повторяющиеся символы. Замените их на более сложные.'
            }
        ]
    },
    {
        id: 'account',
        title: 'Управление аккаунтом',
        icon: UserIcon,
        color: 'text-purple-400',
        questions: [
            {
                id: 'account-1',
                question: 'Как изменить email адрес?',
                answer: 'Перейдите в настройки профиля, введите новый email адрес и подтвердите изменения. На новый адрес будет отправлено письмо с подтверждением.'
            },
            {
                id: 'account-2',
                question: 'Можно ли удалить аккаунт?',
                answer: 'Да, вы можете удалить аккаунт в настройках. Все ваши данные будут безвозвратно удалены через 30 дней. В течение этого периода аккаунт можно восстановить.'
            },
            {
                id: 'account-3',
                question: 'Как поделиться паролем с коллегой?',
                answer: 'Используйте функцию безопасного обмена. Создайте зашифрованную ссылку с ограниченным временем действия или пригласите коллегу в организацию для постоянного доступа к общим паролям.'
            },
            {
                id: 'account-4',
                question: 'Что такое семейный план?',
                answer: 'Семейный план позволяет до 6 членам семьи использовать премиум функции. Каждый получает отдельное защищенное хранилище плюс доступ к общему семейному хранилищу.'
            }
        ]
    },
    {
        id: 'technical',
        title: 'Технические вопросы',
        icon: CogIcon,
        color: 'text-yellow-400',
        questions: [
            {
                id: 'technical-1',
                question: 'Какие браузеры поддерживаются?',
                answer: 'Мы поддерживаем все современные браузеры: Chrome, Firefox, Safari, Edge версии не старше двух лет. Расширения доступны для Chrome, Firefox и Safari.'
            },
            {
                id: 'technical-2',
                question: 'Работает ли приложение без интернета?',
                answer: 'Мобильные приложения сохраняют зашифрованную копию ваших данных для автономного доступа. Веб-версия требует подключения к интернету, но может кэшировать данные для краткосрочного использования.'
            },
            {
                id: 'technical-3',
                question: 'Как настроить синхронизацию между устройствами?',
                answer: 'Синхронизация происходит автоматически при входе в аккаунт на новом устройстве. Убедитесь, что используете один и тот же аккаунт на всех устройствах.'
            },
            {
                id: 'technical-4',
                question: 'Что делать если забыл мастер-пароль?',
                answer: 'К сожалению, мы не можем восстановить мастер-пароль из-за шифрования. Вы можете сбросить аккаунт и начать заново, но все данные будут потеряны. Поэтому важно создать аварийный набор для восстановления.'
            }
        ]
    },
    {
        id: 'billing',
        title: 'Оплата и тарифы',
        icon: DocumentTextIcon,
        color: 'text-orange-400',
        questions: [
            {
                id: 'billing-1',
                question: 'Какие способы оплаты принимаются?',
                answer: 'Мы принимаем все основные банковские карты (Visa, MasterCard, МИР), PayPal, Apple Pay, Google Pay и банковские переводы для корпоративных клиентов.'
            },
            {
                id: 'billing-2',
                question: 'Можно ли отменить подписку?',
                answer: 'Да, вы можете отменить подписку в любое время. Доступ к премиум функциям сохранится до окончания оплаченного периода, после чего аккаунт переключится на бесплатный тариф.'
            },
            {
                id: 'billing-3',
                question: 'Есть ли скидки для студентов?',
                answer: 'Да, студенты получают 50% скидку при предоставлении действующего студенческого билета или справки об обучении. Скидка действует весь период обучения.'
            },
            {
                id: 'billing-4',
                question: 'Что включает корпоративный тариф?',
                answer: 'Корпоративный тариф включает: неограниченные пользователи, централизованное управление, отчеты безопасности, SSO интеграцию, приоритетную поддержку и соответствие требованиям GDPR.'
            }
        ]
    }
]);

const filteredCategories = computed(() => {
    if (!searchQuery.value) return faqCategories.value;
    
    return faqCategories.value.map(category => ({
        ...category,
        questions: category.questions.filter(q => 
            q.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            q.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
    })).filter(category => category.questions.length > 0);
});

const toggleItem = (itemId) => {
    if (expandedItems.value.has(itemId)) {
        expandedItems.value.delete(itemId);
    } else {
        expandedItems.value.add(itemId);
    }
};

const popularQuestions = [
    {
        icon: ShieldCheckIcon,
        question: 'Насколько безопасно хранение данных?',
        category: 'security'
    },
    {
        icon: KeyIcon,
        question: 'Как создать надежный пароль?',
        category: 'passwords'
    },
    {
        icon: DevicePhoneMobileIcon,
        question: 'Работает ли без интернета?',
        category: 'technical'
    },
    {
        icon: DocumentTextIcon,
        question: 'Какие способы оплаты принимаются?',
        category: 'billing'
    }
];

const scrollToCategory = (categoryId) => {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
};
</script>

<template>
    <div class="py-5 space-y-6">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-2xl font-bold mb-2 flex items-center">
                <QuestionMarkCircleIcon class="w-6 h-6 mr-3 text-[#2af16b]" />
                Часто задаваемые вопросы
            </h1>
            <p class="text-[#6a6a6b] text-sm">
                Найдите ответы на популярные вопросы о Secure Storage
            </p>
        </div>

        <!-- Search -->
        <div class="mb-6">
            <div class="relative">
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Поиск по вопросам..."
                    class="w-full px-4 py-3 bg-[#1e1e20] border border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:border-[#2af16b] transition"
                />
            </div>
        </div>

        <!-- Popular Questions -->
        <div v-if="!searchQuery" class="mb-8">
            <h2 class="text-sm mb-4 tracking-wider text-[#6a6a6b] flex items-center">
                <CheckCircleIcon class="w-4 h-4 mr-2" />
                Популярные вопросы
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                    v-for="popular in popularQuestions"
                    :key="popular.question"
                    @click="scrollToCategory(popular.category)"
                    class="flex items-center p-3 bg-[#1e1e20] rounded-lg hover:bg-[#2F2F2F] transition text-left"
                >
                    <component :is="popular.icon" class="w-5 h-5 mr-3 text-[#2af16b] flex-shrink-0" />
                    <span class="text-sm">{{ popular.question }}</span>
                </button>
            </div>
        </div>

        <!-- FAQ Categories -->
        <div class="space-y-6">
            <div 
                v-for="category in filteredCategories" 
                :key="category.id"
                :id="`category-${category.id}`"
                class="bg-[#1e1e20] rounded-lg p-6"
            >
                <!-- Category Header -->
                <div class="flex items-center mb-6">
                    <component :is="category.icon" :class="`w-6 h-6 mr-3 ${category.color}`" />
                    <h2 class="text-lg font-semibold">{{ category.title }}</h2>
                    <span class="ml-auto text-xs px-2 py-1 bg-[#2F2F2F] rounded">
                        {{ category.questions.length }} {{ category.questions.length === 1 ? 'вопрос' : 'вопросов' }}
                    </span>
                </div>

                <!-- Questions -->
                <div class="space-y-3">
                    <div 
                        v-for="question in category.questions" 
                        :key="question.id"
                        class="border border-[#2F2F2F] rounded-lg overflow-hidden"
                    >
                        <!-- Question Header -->
                        <button
                            @click="toggleItem(question.id)"
                            class="w-full flex items-center justify-between p-4 text-left hover:bg-[#2F2F2F] transition"
                        >
                            <span class="font-medium pr-4">{{ question.question }}</span>
                            <ChevronDownIcon 
                                :class="`w-5 h-5 flex-shrink-0 transition-transform ${
                                    expandedItems.has(question.id) ? 'rotate-180' : ''
                                }`"
                            />
                        </button>

                        <!-- Answer -->
                        <div 
                            v-if="expandedItems.has(question.id)"
                            class="px-4 pb-4 border-t border-[#2F2F2F] bg-[#0f0f10]"
                        >
                            <div class="pt-4">
                                <p class="text-[#6a6a6b] leading-relaxed">{{ question.answer }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- No Results -->
        <div v-if="searchQuery && filteredCategories.length === 0" class="text-center py-12">
            <QuestionMarkCircleIcon class="w-12 h-12 mx-auto mb-4 text-[#6a6a6b]" />
            <h3 class="text-lg font-medium mb-2">Ничего не найдено</h3>
            <p class="text-[#6a6a6b] mb-4">Попробуйте изменить поисковый запрос или просмотрите все категории</p>
            <button
                @click="searchQuery = ''"
                class="px-4 py-2 bg-[#2af16b] text-black rounded-lg hover:bg-[#2af16b]/80 transition text-sm"
            >
                Показать все вопросы
            </button>
        </div>

        <!-- Contact Support -->
        <div class="bg-[#2af16b]/10 border border-[#2af16b]/20 rounded-lg p-6">
            <div class="flex items-start">
                <QuestionMarkCircleIcon class="w-6 h-6 text-[#2af16b] mr-4 flex-shrink-0 mt-1" />
                <div>
                    <h3 class="font-semibold mb-2 text-[#2af16b]">Не нашли ответ?</h3>
                    <p class="text-[#6a6a6b] mb-4 text-sm">
                        Свяжитесь с нашей службой поддержки, и мы поможем решить любые вопросы в течение 24 часов.
                    </p>
                    <div class="flex flex-wrap gap-3">
                        <button class="px-4 py-2 bg-[#2af16b] text-black rounded-lg hover:bg-[#2af16b]/80 transition text-sm">
                            Написать в поддержку
                        </button>
                        <button class="px-4 py-2 border border-[#2af16b] text-[#2af16b] rounded-lg hover:bg-[#2af16b]/10 transition text-sm">
                            Чат с консультантом
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
