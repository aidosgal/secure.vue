<script setup lang="ts">
    import Layout from "@/shared/ui/Layout.vue";
    import AuthModal from "@/widgets/auth/AuthModel.vue";
</script>

<template>
    <div>
        <Layout>
            <router-view />
        </Layout>
        <AuthModal />
    </div>
</template>
