<template>
  <div v-if="open" class="fixed inset-0 z-[60] flex items-center justify-center" @click.self="emitClose">
    <div class="absolute inset-0 bg-black/40"></div>
    <div class="relative w-full max-w-sm rounded-lg bg-white shadow-xl">
      <div class="flex items-center justify-between border-b border-gray-200 px-5 py-3">
        <h3 class="text-base font-semibold text-gray-900">
          {{ resolvedTitle }}
        </h3>
        <button
          type="button"
          class="rounded-md p-1 text-gray-500 hover:bg-gray-100"
          aria-label="닫기"
          @click="emitClose">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div class="px-5 py-4">
        <p v-if="resolvedMessage" class="text-sm text-gray-700">
          {{ resolvedMessage }}
        </p>
        <p v-if="errorMessage" class="mt-2 text-xs text-red-600">
          {{ errorMessage }}
        </p>
      </div>

      <div class="flex items-center justify-end gap-2 border-t border-gray-200 px-5 py-3">
        <button
          v-if="resolvedShowCancel"
          type="button"
          class="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          @click="emitClose">
          {{ resolvedCancelText }}
        </button>
        <button
          type="button"
          class="rounded-md bg-pink-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-pink-600"
          @click="emitConfirm">
          {{ resolvedConfirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  open: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  errorMessage?: string | null
  showCancel?: boolean
}>()

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'confirm'): void
}>()

const emitClose = () => {
  emit('close')
}

const emitConfirm = () => {
  emit('confirm')
}

const resolvedTitle = computed(() => props.title ?? '확인')
const resolvedMessage = computed(() => props.message ?? '')
const resolvedConfirmText = computed(() => props.confirmText ?? '확인')
const resolvedCancelText = computed(() => props.cancelText ?? '취소')
const resolvedShowCancel = computed(() => props.showCancel ?? true)
</script>
