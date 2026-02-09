<template>
  <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    <div class="text-xs font-semibold text-gray-500">진행 상태</div>
    <p class="mt-1 text-sm text-gray-700">{{ step }}</p>
    <progress class="progress mt-3 w-full"></progress>
  </div>
</template>

<script setup lang="ts">
defineProps<{ step: string }>()
</script>
