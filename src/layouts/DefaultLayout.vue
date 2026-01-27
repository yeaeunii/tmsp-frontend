<template>
  <div class="min-h-screen flex flex-col">
    <Header />

    <main class="flex-1">
      <router-view />
    </main>
  </div>

   <!-- <Footer /> -->
</template>

<script setup lang="ts">
import Header from '@/layouts/components/Header.vue'
// footer
</script>
