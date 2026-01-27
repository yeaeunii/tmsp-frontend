<template>
  <div v-if="open" class="fixed inset-0 z-[60] flex items-center justify-center" @click.self="emitClose">
    <div class="absolute inset-0 bg-black/40"></div>
    <div class="relative w-full max-w-sm rounded-lg bg-white shadow-xl">
      <div class="flex items-center justify-between border-b border-gray-200 px-5 py-3">
        <h3 class="text-base font-semibold text-gray-900">
          {{ title }}
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
        <label class="text-sm text-gray-700">비밀번호</label>
        <input
          v-model="password"
          type="password"
          class="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-pink-400 focus:ring-pink-300"
          placeholder="비밀번호를 입력하세요"
          @keyup.enter="emitConfirm"
        />
        <p v-if="errorMessage" class="mt-2 text-xs text-red-600">
          {{ errorMessage }}
        </p>
      </div>

      <div class="flex items-center justify-end gap-2 border-t border-gray-200 px-5 py-3">
        <button
          type="button"
          class="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          @click="emitClose">
          {{ cancelText }}
        </button>
        <button
          type="button"
          class="rounded-md bg-pink-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-pink-600"
          @click="emitConfirm">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  open: boolean
  title?: string
  confirmText?: string
  cancelText?: string
  errorMessage?: string | null
}>()

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'confirm', password: string): void
}>()

const password = ref('')

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      password.value = ''
    }
  }
)

const emitClose = () => {
  emit('close')
}

const emitConfirm = () => {
  emit('confirm', password.value)
}

const title = props.title ?? '비밀번호 확인'
const confirmText = props.confirmText ?? '확인'
const cancelText = props.cancelText ?? '취소'
</script>
