<template>
  <div class="min-h-screen bg-blue-50">
    <div class="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-12">
      <div class="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
        <div class="hidden rounded-3xl bg-gradient-to-br from-zinc-200 via-zinc-100 to-blue-100 p-10 text-black md:block">
          <div class="flex h-full flex-col justify-between">
            <div>
              <div class="text-sm uppercase tracking-widest text-black">tmsP</div>
              <h1 class="mt-6 text-3xl font-bold leading-tight">
                환영합니다
                <span class="block text-black">새 계정을 만들어요</span>
              </h1>
              <p class="mt-4 text-sm text-black">
                회원가입 후 문서 허브와 자동화 기능을 바로 사용할 수 있어요.
              </p>
            </div>

          </div>
        </div>

        <div class="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-blue-200">
          <div class="mb-6">
            <h2 class="text-2xl font-semibold text-black">회원가입</h2>
            <p class="mt-2 text-sm text-black">정보를 입력해 계정을 만들어 주세요.</p>
          </div>

        <form @submit.prevent="submitPost" class="space-y-6">

            <div>
              <label class="text-sm font-medium text-black">이름</label>
              <input
                type="text"
                v-model="form.username"
                @input="handleUsernameInput"
                placeholder=""
                class="mt-2 w-full rounded-xl border border-blue-200 px-4 py-3 text-sm text-black placeholder:text-black/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <p v-if="usernameError" class="mt-2 text-xs text-red-600">
                {{ usernameError }}
              </p>
            </div>

            <div>
              <label class="text-sm font-medium text-black">아이디</label>
              <input
                type="text"
                v-model="form.loginId"
                @input="handleLoginIdInput"
                placeholder=""
                class="mt-2 w-full rounded-xl border border-blue-200 px-4 py-3 text-sm text-black placeholder:text-black/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <p v-if="loginIdMessage" class="mt-2 text-xs text-red-600">
              {{ loginIdMessage }}
            </p>
              <p v-if="loginIdError" class="mt-2 text-xs text-red-600">
                {{ loginIdError }}
              </p>
            </div>

            <div>
              <label class="text-sm font-medium text-black">이메일</label>
              <input
                type="email"
                v-model="form.email"
                @input="handleEmailInput"
                placeholder="you@example.com"
                class="mt-2 w-full rounded-xl border border-blue-200 px-4 py-3 text-sm text-black placeholder:text-black/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <p v-if="emailError" class="mt-2 text-xs text-red-600">
                {{ emailError }}
              </p>
            </div>

            <div>
              <label class="text-sm font-medium text-black">비밀번호</label>
              <input
                type="password"
                v-model="form.password"
                @input="handlePasswordInput"
                class="mt-2 w-full rounded-xl border border-blue-200 px-4 py-3 text-sm text-black placeholder:text-black/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <p v-if="passwordError" class="mt-2 text-xs text-red-600">
              {{ passwordError }}
            </p>
            </div>

            <div>
              <label class="text-sm font-medium text-black">비밀번호 확인</label>
              <input
                type="password"
                v-model="confirmPassword"
                @input="handlePasswordComfirm"
                class="mt-2 w-full rounded-xl border border-blue-200 px-4 py-3 text-sm text-black placeholder:text-black/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <p v-if="passwordCom" class="mt-2 text-xs text-red-600">
              {{ passwordCom }}
            </p>
            </div>

            <div class="flex items-start gap-3 text-sm text-black">
              <input type="checkbox" class="mt-1 size-4 rounded border-blue-300 text-black focus:ring-blue-500" />
              <span>이용약관 및 개인정보 처리방침에 동의합니다.</span>
            </div>

            <button
              type="submit"
              class="w-full rounded-xl bg-blue-200 px-4 py-3 text-sm font-semibold text-black shadow-lg shadow-blue-200/40 transition hover:bg-blue-300"
            >
              계정 만들기
            </button>
          </form>

          <div class="mt-6 text-center text-sm text-black">
            이미 계정이 있나요?
            <RouterLink to="/login" class="font-semibold text-black hover:text-black/70">로그인</RouterLink>
          </div>
        </div>
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
  username: '',
  loginId: '',
  email: '',
  password: ''
})

const confirmPassword = ref('')
const showAlertModal = ref<boolean>(false)
const alertMessage = ref<string>('')
const loginIdMessage = ref<string | null>(null)
const usernameError = ref<string | null>(null)
const loginIdError = ref<string | null>(null)
const emailError = ref<string | null>(null)
const passwordError = ref<string | null>(null)
const passwordCom = ref<string | null>(null)


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

  if (!rawValue) {
    passwordError.value = null
  } else {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,16}$/
    passwordError.value = passwordPattern.test(rawValue)
      ? null
      : '8~16자의 영문 대/소문자, 숫자, 특수문자를 사용해 주세요.'
  }

  if (confirmPassword.value) {
    passwordCom.value = confirmPassword.value === rawValue ? null : '비밀번호와 동일하게 입력하세요'
  }
}

const handlePasswordComfirm = (event: Event) => {
  const input = event.target as HTMLInputElement
  const rawValue = input.value

  if (!rawValue) {
    passwordCom.value = null
  } else {
    passwordCom.value = rawValue === form.value.password ? null : '비밀번호와 동일하게 입력하세요'
  }
}

const handleUsernameInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const rawValue = input.value
  usernameError.value = rawValue && rawValue.trim().length > 15
    ? '이름은 15글자 이내로 입력하세요.'
    : null
}

const handleLoginIdInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const rawValue = input.value
  if (!rawValue) {
    loginIdError.value = null
    return
  }
  loginIdError.value = /^[A-Za-z]{1,10}$/.test(rawValue)
    ? null
    : '아이디는 영문만 10글자 이내로 입력하세요.'
}

const handleEmailInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const rawValue = input.value
  if (!rawValue) {
    emailError.value = null
    return
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  emailError.value = emailPattern.test(rawValue)
    ? null
    : '이메일 형식이 올바르지 않습니다.'
}

const submitPost = async () => {
  if (!form.value.username || !form.value.loginId || !form.value.email || !form.value.password || !confirmPassword.value) {
    openAlert('필수값을 입력하세요.')
    return
  }

  const username = form.value.username.trim()
  const loginId = form.value.loginId.trim()
  const email = form.value.email.trim()

  if (username.length > 15) {
    usernameError.value = '이름은 15글자 이내로 입력하세요.'
    return
  }

  if (!/^[A-Za-z]{1,10}$/.test(loginId)) {
    loginIdError.value = '아이디는 영문만 10글자 이내로 입력하세요.'
    return
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email)) {
    emailError.value = '이메일 형식이 올바르지 않습니다.'
    return
  }

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.value),
    })

    if (!response.ok) {
     if (response.status === 409) {
       loginIdMessage.value = '이미 존재하는 아이디 입니다'
      } else {
          openAlert('회원가입 오류')
      }
      return
    }


    //로그인페이지로 이동 
    router.push('/login')



  } catch (e) {
    console.error(e)
    openAlert('오류가 발생했습니다.')
  }
}
</script>
