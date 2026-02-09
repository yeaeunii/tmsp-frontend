<template>
  <div class="bg-gray-50 py-16 sm:py-20">
    <div class="mx-auto max-w-4xl px-6 lg:px-8">
      <div class="mb-10">
        <h2 class="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          카드 작성
        </h2>
        <p class="mt-2 text-sm text-gray-500">
          카드에 표시될 내용을 입력하세요.
        </p>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <form @submit.prevent="submitNewsletter" class="space-y-6">
          <div class="grid gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">카테고리</label>
              <select
                v-model="form.category"
                class="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-400 focus:ring-blue-200"
              >
                <option value="">선택</option>
                <option value="UI/UX 이슈">UI/UX 이슈</option>
                <option value="QA 증빙">QA 증빙</option>
                <option value="인프라 / 설정 공유">인프라 / 설정 공유</option>
                <option value="운영 이슈">운영 이슈</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">작성자</label>
              <input
                type="text"
                :value="userStore.username || ''"
                readonly
                class="mt-2 block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
                placeholder="로그인 필요"
              />
            </div>
            
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">제목</label>
            <input
              v-model="form.title"
              type="text"
              class="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-400 focus:ring-blue-200"
              placeholder="제목을 입력하세요"
            />
            <p class="mt-2 text-xs text-gray-500">
              입력한 제목은 업로드한 이미지 파일명으로 사용됩니다.
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">요약</label>
            <textarea
              v-model="form.description"
              rows="4"
              class="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-400 focus:ring-blue-200"
              placeholder="카드에 노출될 요약 내용을 입력하세요"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">이미지</label>
            <input
              ref="imageInput"
              type="file"
              accept="image/*"
              class="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-600 hover:file:bg-blue-100"
              @change="handleImageChange" multiple/>
            <div v-if="previewUrls.length > 0" class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div
                v-for="(url, index) in previewUrls"
                :key="url"
                class="overflow-hidden rounded-xl border border-gray-200">
                <img :src="url" :alt="`미리보기-${index + 1}`" class="h-48 w-full object-cover" />
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button
              type="button"
              class="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              @click="goBack" >
              취소
            </button>
            <button
              type="submit"
              class="rounded-md bg-blue-500 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-600" >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <Commodal
    :open="showAlertModal"
    title="알림"
    :message="alertMessage"
    :show-cancel="false"
    confirm-text="확인"
    @close="closeAlert"
    @confirm="closeAlert"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Commodal from '@/components/modal/Commodal.vue'
import { useUserStore } from '@/store/user'
import { authFetch } from '@/utils/api'

const router = useRouter()
const userStore = useUserStore()
const imageInput = ref<HTMLInputElement | null>(null)

const form = ref({
  category: '',
  title: '',
  description: '',
  images: [] as File[],
})

const previewUrls = ref<string[]>([])
const showAlertModal = ref(false)
const alertMessage = ref('')

const openAlert = (message: string) => {
  alertMessage.value = message
  showAlertModal.value = true
}

const closeAlert = () => {
  showAlertModal.value = false
}

const handleImageChange = () => {
  const files = Array.from(imageInput.value?.files ?? [])
  form.value.images = files

  previewUrls.value.forEach((url) => URL.revokeObjectURL(url))
  previewUrls.value = files.map((file) => URL.createObjectURL(file))
}

const goBack = () => {
  router.push('/newsletter')
}

const submitNewsletter = () => {
  if (!form.value.category || !form.value.title.trim() || !form.value.description.trim()) {
    openAlert('필수값을 입력하세요.')
    return
  }
  if (!userStore.isLogin || !userStore.memberId || !userStore.username) {
    openAlert('로그인 정보가 없습니다. 다시 로그인해 주세요.')
    return  router.push('/login')
  }

  const formData = new FormData()
  formData.append('memberId', String(userStore.memberId))
  formData.append('username', String(userStore.username))
  formData.append('category', form.value.category)
  formData.append('title', form.value.title.trim())
  formData.append('description', form.value.description.trim())
  form.value.images.forEach((file) => {
    formData.append('images', file, file.name)
  })

  authFetch('/api/newsletter/write', {
    method: 'POST',
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('저장 실패')
      }
      router.push('/newsletter')
    })
    .catch((error) => {
      console.error(error)
      openAlert('오류가 발생했습니다.')
    })
}
</script>
