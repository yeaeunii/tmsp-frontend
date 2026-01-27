<template>
  <div class="bg-gray-100 py-24 sm:py-32 min-h-screen">
    <div class="mx-auto max-w-3xl px-6 lg:px-8">
      
      <!-- 제목 -->
      <div class="mb-10">
        <h2 class="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          게시글 작성
        </h2>
        <p class="mt-2 text-sm text-gray-500">
          게시판에 등록될 글을 작성해주세요.
        </p>
      </div>

     
      <div class="bg-white border border-pink-200 rounded-xl shadow-sm p-6 sm:p-8">
        <form @submit.prevent="submitPost" class="space-y-6">

          <!-- 닉네임 -->
          <div>
            <label class="block text-sm font-medium text-gray-700">
              닉네임
            </label>
            <input
              type="text"
              v-model="form.writer"
              class="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2
                     text-sm text-gray-900 focus:border-pink-400 focus:ring-pink-300"
              placeholder="닉네임을 입력하세요"
            />
          </div>

          <!-- 제목 -->
          <div>
            <label class="block text-sm font-medium text-gray-700">
              제목
            </label>
            <input
              type="text"
              v-model="form.title"
              class="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2
                     text-sm text-gray-900 focus:border-pink-400 focus:ring-pink-300"
              placeholder="제목을 입력하세요"
            />
          </div>

          <!-- 내용 -->
          <div>
            <label class="block text-sm font-medium text-gray-700">
              내용
            </label>
            <textarea
              v-model="form.content"
              rows="6"
              class="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2
                     text-sm text-gray-900 focus:border-pink-400 focus:ring-pink-300"
              placeholder="내용을 입력하세요"
            ></textarea>
          </div>

          <!-- 비밀번호 -->
          <div>
            <label class="block text-sm font-medium text-gray-700">
             게시글 비밀번호
            </label>
            <p class="mt-1 text-xs text-red-500">
              * 비밀번호는 숫자 4글자로 입력해주세요.
            </p>
            <input
              type="password"
              v-model="form.boardPW"
              @input="handlePasswordInput"
              class="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2
                     text-sm text-gray-900 focus:border-pink-400 focus:ring-pink-300"
            />
            <p v-if="passwordError" class="mt-2 text-xs text-red-600">
              {{ passwordError }}
            </p>
          </div>

          <!-- 버튼 -->
          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="router.push('/')"
              class="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              class="rounded-md bg-pink-500 px-6 py-2 text-sm font-semibold text-white
                     hover:bg-pink-600 shadow-sm"
            >
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

const router = useRouter()

const form = ref({
  writerid : '1',
  writer: '',
  title: '',
  content: '',
  boardPW: '',
})

const showAlertModal = ref<boolean>(false)
const alertMessage = ref<string>('')
const passwordError = ref<string | null>(null)

const openAlert = (message: string) => {
  alertMessage.value = message
  showAlertModal.value = true
}

const closeAlert = () => {
  showAlertModal.value = false
}

const handlePasswordInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const rawValue = input.value

  if (rawValue && !/^\d*$/.test(rawValue)) {
    passwordError.value = '숫자로만 입력하세요.'
  } else if (rawValue.length > 4) {
    passwordError.value = '4글자로 입력하세요.'
  } else if (rawValue.length > 0 && rawValue.length < 4) {
    passwordError.value = '4글자로 입력하세요.'
  } else {
    passwordError.value = null
  }

  const digitsOnly = rawValue.replace(/\D/g, '').slice(0, 4)
  if (digitsOnly !== rawValue) {
    form.value.boardPW = digitsOnly
  }
}

const submitPost = async () => {
  if (!form.value.writer || !form.value.title || !form.value.content) {
    openAlert('필수값을 입력하세요.')
    return
  }

  if (passwordError.value) {
    openAlert(passwordError.value)
    return
  }
  if (!form.value.boardPW || form.value.boardPW.length !== 4) {
    openAlert('비밀번호는 숫자 4글자로 입력해주세요.')
    return
  }

  try {
    const response = await fetch('/api/board/postwrite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.value),
    })

    if (!response.ok) {
      throw new Error('저장 실패')
    }


    //목록페이지로 이동 
    router.push('/')



  } catch (e) {
    console.error(e)
    openAlert('오류가 발생했습니다.')
  }
}
</script>
