<script setup lang="ts">
import NavBar from "@/widgets/header/NavBar.vue";
import LeftBar from "@/widgets/sidebar/LeftBar.vue";
import RightBar from "@/widgets/sidebar/RightBar.vue";
import { ref } from "vue";

const isLogined = ref(false);
</script>

<template>
  <div class="h-screen flex flex-col mx-auto w-[1200px]">
    <NavBar />

    <div class="h-full">
      <div v-if="isLogined" class="grid grid-cols-5 h-full">
        <div class="col-span-1 h-full overflow-hidden">
          <LeftBar />
        </div>
        <main class="col-span-3 h-full overflow-y-auto p-5 hide-scrollbar">
          <slot />
        </main>
        <div class="col-span-1 h-full overflow-hidden">
          <RightBar />
        </div>
      </div>

      <div v-else class="h-full p-5 hide-scrollbar">
        <slot />
      </div>
    </div>
  </div>
</template>

