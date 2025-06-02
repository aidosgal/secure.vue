<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const uidb64 = route.params.uidb64 as string;
const token = route.params.token as string;

onMounted(async () => {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/secure-storage/user/confirm/${uidb64}/${token}/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        if (!response.ok) {
            throw new Error("Confirmation failed");
        }

        const data = await response.json();

        // Try to decode uidb64 (Base64)
        try {
            const decoded = atob(uidb64); // basic Base64 decode
            const userId = parseInt(decoded);
            if (!isNaN(userId)) {
                localStorage.setItem("user_id", userId.toString());
            }
        } catch (err) {
            console.warn("Failed to decode uidb64", err);
        }

        // Redirect or show a success message
        router.push({ name: "profile" }); // or 'home' or wherever you want
    } catch (err) {
        console.error(err);
    }
});
</script>

<template>
    <div class="p-6 text-center">
        <h1 class="text-2xl font-bold text-white">Подтверждение аккаунта...</h1>
        <p class="text-[#6a6a6b]">
            Пожалуйста, подождите, мы подтверждаем ваш аккаунт.
        </p>
    </div>
</template>
