<template>
  <div class="min-h-screen bg-blue-50">
    <div class="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-12">
      <div class="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
        <div class="hidden rounded-3xl bg-gradient-to-br from-zinc-200 via-zinc-100 to-blue-100 p-10 text-black md:block">
          <div class="flex h-full flex-col justify-between">
            <div>
              <div class="text-sm uppercase tracking-widest text-black">tmsP</div>
              <h1 class="mt-6 text-3xl font-bold leading-tight">
                환영해요
                <span class="block text-black">계정에 로그인하세요</span>
              </h1>
              <p class="mt-4 text-sm text-black">
                로그인 후 문서 허브와 자동화 기능을 계속 이용할 수 있어요.
              </p>
            </div>

          </div>
        </div>

        <div class="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-blue-200">
          <div class="mb-6">
            <h2 class="text-2xl font-semibold text-black">로그인</h2>
            <p class="mt-2 text-sm text-black">아이디와 비밀번호를 입력해 주세요.</p>
          </div>

          <form @submit.prevent="submitPost" class="space-y-5">
            <div>
              <label class="text-sm font-medium text-black">아이디</label>
              <input
                type="text"
                v-model="form.loginId"
                class="mt-2 w-full rounded-xl border border-blue-200 px-4 py-3 text-sm text-black placeholder:text-black/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label class="text-sm font-medium text-black">비밀번호</label>
              <input
                type="password"
                v-model="form.password"
                class="mt-2 w-full rounded-xl border border-blue-200 px-4 py-3 text-sm text-black placeholder:text-black/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <p v-if="authCom" class="mt-2 text-xs text-red-600">
              {{ authCom }}
            </p>
            </div>

            <!-- <div class="flex items-center text-sm">
              <a href="#" class="ml-auto text-right text-black hover:text-black/70">비밀번호 찾기</a>
            </div> -->

            <button
              type="submit"
              class="w-full rounded-xl bg-blue-200 px-4 py-3 text-sm font-semibold text-black shadow-lg shadow-blue-200/40 transition hover:bg-blue-300"
            >
              로그인
            </button>
          </form>

          <div class="mt-6 text-center text-sm text-black">
            계정이 없나요?
            <RouterLink to="/register" class="font-semibold text-black hover:text-black/70">회원가입</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>







<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const form = ref({
  loginId: '',
  password: ''
})

const authCom = ref<string | null>(null)

const submitPost = async () => {

  if (!form.value.loginId  || !form.value.password ) {
    authCom.value = '필수값을 입력하세요'
    return
  }



  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.value),
    })


    if (!response.ok) {
     if (response.status === 401) {
       authCom.value = '아이디(로그인 전화번호, 로그인 전용 아이디) 또는 비밀번호가 잘못 되었습니다. 아이디와 비밀번호를 정확히 입력해 주세요.'
      }else if (response.status === 404) {
       authCom.value = '존재하지 않는 아이디 입니다. 회원가입해주세요'
      }else {
       authCom.value = '관리자에게 문의하세요'
      }
      return

    }

   
   const data = await response.json()
  //  debugger
  console.log(data)

    userStore.setUser({
      username: data.username,
      role: data.role,
      memberId: data.memberId ?? data.id ?? null,
    })


    const redirectTarget = Array.isArray(route.query.redirect)
      ? route.query.redirect[0]
      : route.query.redirect

    router.push(redirectTarget ?? '/')



  } catch (e) {
    console.error(e)
  }
}
</script>
