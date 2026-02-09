<template>
  <DefaultLayout />

  <Commodal
    :open="showAuthExpired"
    title="알림"
    :message="authExpiredMessage"
    :show-cancel="false"
    confirm-text="확인"
    @close="handleAuthExpiredClose"
    @confirm="handleAuthExpiredClose"
  />

  <Commodal
    :open="showInvalidAccess"
    title="알림"
    :message="invalidAccessMessage"
    :show-cancel="false"
    confirm-text="확인"
    @close="handleInvalidAccessClose"
    @confirm="handleInvalidAccessClose"
  />

</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useUserStore } from '@/store/user'
import Commodal from '@/components/modal/Commodal.vue'

const userStore = useUserStore()
const router = useRouter()

const showAuthExpired = ref(false)
const authExpiredMessage = '로그인이 만료되었습니다. 다시 로그인해 주세요.'

const showInvalidAccess = ref(false)
const invalidAccessMessage = ref('')


const handleAuthExpired = () => {
  userStore.clearUser()
  showAuthExpired.value = true
}

const handleAuthExpiredClose = () => {
  showAuthExpired.value = false
  router.push('/login')
}

const handleInvalidAccess = (event: Event) => {
  const detail = (event as CustomEvent<{ message?: string }>).detail
  invalidAccessMessage.value = detail?.message ?? '로그인이 필요합니다.'
  showInvalidAccess.value = true
}

const handleInvalidAccessClose = () => {
  showInvalidAccess.value = false
}

onMounted(() => {
  window.addEventListener('auth-expired', handleAuthExpired)
  window.addEventListener('invalid-access', handleInvalidAccess)
})


onBeforeUnmount(() => {
  window.removeEventListener('auth-expired', handleAuthExpired)
  window.removeEventListener('invalid-access', handleInvalidAccess)
})

</script>
