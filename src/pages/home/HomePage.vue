<script setup>
import Banner from "./Banner.vue";
</script>

<template>
  <div class="min-h-screen text-white">
    <Banner />
    <section class="py-20 px-4 relative overflow-hidden">
      <div class="absolute inset-0 opacity-5">
        <div class="absolute top-20 left-10 w-64 h-64 bg-green-500 rounded-full blur-3xl"></div>
        <div class="absolute bottom-20 right-10 w-48 h-48 bg-green-400 rounded-full blur-2xl"></div>
      </div>
      
      <div class="max-w-6xl mx-auto relative z-10">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-6">
            Про нас
          </h2>
          <div class="w-24 h-1 bg-green-500 mx-auto mb-8"></div>
          <p class="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Мы создаем безопасные и инновационные решения для хранения данных, 
            обеспечивая максимальную защиту и удобство для наших пользователей.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div class="space-y-6">
            <div class="bg-gradient-to-br from-gray-900 to-black p-8 rounded-lg border border-gray-800">
              <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9l-5 4.87L18.18 21 12 17.27 5.82 21 7 13.87 2 9l6.91-1.74L12 1z"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-3">Наша миссия</h3>
              <p class="text-gray-300">
                Обеспечить безопасное и надежное хранение данных для каждого пользователя, 
                используя передовые технологии шифрования и защиты информации.
              </p>
            </div>
            
            <div class="bg-gradient-to-br from-gray-900 to-black p-8 rounded-lg border border-gray-800">
              <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-3">Наши ценности</h3>
              <p class="text-gray-300">
                Мы ценим доверие, инновации и прозрачность. Каждое решение принимается 
                с учетом интересов и безопасности наших клиентов.
              </p>
            </div>
          </div>

          <div class="bg-gradient-to-br from-gray-900 to-black p-12 rounded-lg border border-gray-800 text-center">
            <div class="text-6xl font-bold text-green-500 mb-4">5+</div>
            <p class="text-xl mb-6">лет опыта в области кибербезопасности</p>
            <div class="grid grid-cols-2 gap-6 text-center">
              <div>
                <div class="text-2xl font-bold text-green-500">10k+</div>
                <p class="text-gray-300">Пользователей</p>
              </div>
              <div>
                <div class="text-2xl font-bold text-green-500">99.9%</div>
                <p class="text-gray-300">Uptime</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 px-4 relative overflow-hidden">
      <div class="max-w-6xl mx-auto relative z-10">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-6">
            Преимущества
          </h2>
          <div class="w-24 h-1 bg-green-500 mx-auto mb-8"></div>
          <p class="text-xl text-gray-300 max-w-3xl mx-auto">
            Почему тысячи пользователей выбирают именно нас для хранения своих данных
          </p>
        </div>

        <div class="grid grid-cols-2 gap-8">
          <div class="p-8 rounded-lg border border-gray-800 hover:border-green-500 transition-all duration-300 group">
            <div class="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.4 16,11.9 16,12.5V16.5C16,17.1 15.6,17.5 15,17.5H9C8.4,17.5 8,17.1 8,16.5V12.5C8,11.9 8.4,11.5 9,11.5V10C9,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.2,9.2 10.2,10V11.5H13.8V10C13.8,9.2 12.8,8.2 12,8.2Z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-4">Максимальная безопасность</h3>
            <p class="text-gray-300 mb-4">
              End-to-end шифрование данных с использованием алгоритмов AES-256 
              обеспечивает полную конфиденциальность ваших файлов.
            </p>
            <div class="flex items-center text-green-500 text-sm">
              <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Военный уровень защиты
            </div>
          </div>

          <div class="p-8 rounded-lg border border-gray-800 hover:border-green-500 transition-all duration-300 group">
            <div class="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,18.5C15.5,18.5 19.31,17.56 22.25,15.25C22.85,14.74 23.26,14 23.26,13.26C23.26,11.44 20.84,10.24 18.5,9.7C21,9.16 23.5,7.5 23.5,5.25C23.5,2.5 18.5,0.5 12,0.5C5.5,0.5 0.5,2.5 0.5,5.25C0.5,7.5 3,9.16 5.5,9.7C3.16,10.24 0.74,11.44 0.74,13.26C0.74,14 1.15,14.74 1.75,15.25C4.69,17.56 8.5,18.5 12,18.5M12,2C16.5,2 21,3.5 21,5.25C21,7 16.5,8.5 12,8.5C7.5,8.5 3,7 3,5.25C3,3.5 7.5,2 12,2M12,10.5C15.5,10.5 18.74,11.86 18.74,13.26C18.74,14.66 15.5,16 12,16C8.5,16 5.26,14.66 5.26,13.26C5.26,11.86 8.5,10.5 12,10.5Z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-4">Высокая скорость</h3>
            <p class="text-gray-300 mb-4">
              Современная инфраструктура и оптимизированные серверы обеспечивают 
              молниеносную скорость загрузки и синхронизации файлов.
            </p>
            <div class="flex items-center text-green-500 text-sm">
              <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              До 10 Гбит/с скорость передачи
            </div>
          </div>

          <div class="bg-black p-8 rounded-lg border border-gray-800 hover:border-green-500 transition-all duration-300 group">
            <div class="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-4">Надежность 24/7</h3>
            <p class="text-gray-300 mb-4">
              Наши серверы работают круглосуточно с резервным копированием 
              и мониторингом для обеспечения 99.9% доступности сервиса.
            </p>
            <div class="flex items-center text-green-500 text-sm">
              <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Гарантия SLA 99.9%
            </div>
          </div>

          <div class="bg-black p-8 rounded-lg border border-gray-800 hover:border-green-500 transition-all duration-300 group">
            <div class="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17,12C17,14.42 15.28,16.44 13,16.9V21H11V16.9C8.72,16.44 7,14.42 7,12C7,9.58 8.72,7.56 11,7.1V3H13V7.1C15.28,7.56 17,9.58 17,12M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-4">Простота использования</h3>
            <p class="text-gray-300 mb-4">
              Интуитивно понятный интерфейс и простая настройка позволяют 
              начать работу за считанные минуты без технических знаний.
            </p>
            <div class="flex items-center text-green-500 text-sm">
              <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Настройка за 2 минуты
            </div>
          </div>

          <div class="bg-black p-8 rounded-lg border border-gray-800 hover:border-green-500 transition-all duration-300 group">
            <div class="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-4">Масштабируемость</h3>
            <p class="text-gray-300 mb-4">
              От персональных нужд до корпоративных решений - наша платформа 
              легко масштабируется под любые требования и объемы данных.
            </p>
            <div class="flex items-center text-green-500 text-sm">
              <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              От 1GB до неограниченного объема
            </div>
          </div>

          <div class="bg-black p-8 rounded-lg border border-gray-800 hover:border-green-500 transition-all duration-300 group">
            <div class="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,23A1,1 0 0,1 11,22V19H7A2,2 0 0,1 5,17V7A2,2 0 0,1 7,5H21A2,2 0 0,1 23,7V17A2,2 0 0,1 21,19H16.9L13.2,22.71C13,22.89 12.76,23 12.5,23H12M13,17V20.08L16.08,17H21V7H7V17H13M3,15H1V3A2,2 0 0,1 3,1H19V3H3V15M9,9H19V11H9V9M9,13H17V15H9V13Z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-4">Поддержка 24/7</h3>
            <p class="text-gray-300 mb-4">
              Наша команда технической поддержки готова помочь вам в любое время. 
              Среднее время ответа составляет менее 15 минут.
            </p>
            <div class="flex items-center text-green-500 text-sm">
              <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Ответ в течение 15 минут
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 px-4 relative overflow-hidden">
      <div class="absolute inset-0 opacity-5">
        <div class="absolute top-10 left-1/4 w-48 h-48 bg-green-500 rounded-full blur-3xl"></div>
        <div class="absolute bottom-10 right-1/4 w-32 h-32 bg-green-400 rounded-full blur-2xl"></div>
      </div>

      <div class="max-w-6xl mx-auto relative z-10">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-6">
            Контакты
          </h2>
          <div class="w-24 h-1 bg-green-500 mx-auto mb-8"></div>
          <p class="text-xl text-gray-300 max-w-3xl mx-auto">
            Свяжитесь с нами любым удобным способом. Мы всегда готовы ответить на ваши вопросы
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
            <div class="bg-gradient-to-br from-gray-900 to-black p-8 rounded-lg border border-gray-800">
              <div class="flex items-center mb-6">
                <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                  <svg class="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-white">Адрес</h3>
                  <p class="text-gray-300">г. Астана, ул. Технологическая 15, офис 201</p>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-gray-900 to-black p-8 rounded-lg border border-gray-800">
              <div class="flex items-center mb-6">
                <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                  <svg class="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-white">Телефон</h3>
                  <p class="text-gray-300">+7 (7172) 123-456</p>
                  <p class="text-gray-300">+7 (777) 123-4567</p>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-gray-900 to-black p-8 rounded-lg border border-gray-800">
              <div class="flex items-center mb-6">
                <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                  <svg class="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-white">Email</h3>
                  <p class="text-gray-300">support@securestorage.kz</p>
                  <p class="text-gray-300">info@securestorage.kz</p>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-gray-900 to-black p-8 rounded-lg border border-gray-800">
              <div class="flex items-center mb-6">
                <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                  <svg class="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-white">Время работы</h3>
                  <p class="text-gray-300">Пн-Пт: 09:00 - 18:00</p>
                  <p class="text-gray-300">Сб-Вс: 10:00 - 16:00</p>
                </div>
              </div>
            </div>

        </div>
        </div>
    </section>
  </div>
</template>
