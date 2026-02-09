<template>
  <div class="bg-gray-50 py-16 sm:py-20">
    <div class="mx-auto max-w-4xl px-6 lg:px-8">
      <div class="text-center">
        <div
          class="mx-auto inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
          MANUAL
        </div>
        <h1 class="mt-4 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          매뉴얼 자동화
        </h1>
        <p class="mt-2 text-sm text-gray-500">
          업무 매뉴얼을 더 빠르고 정확하게 정리하세요
        </p>
      </div>

      <div class="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <!-- URL 입력 -->
        <section>
          <label class="block text-sm font-medium text-gray-700">분석할 URL</label>
          <input
            v-model="url"
            placeholder="https://example.com"
            class="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm
                   text-gray-900 placeholder:text-gray-400
                   focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </section>

        <!-- 옵션 -->
        <!-- <section class="mt-6 flex flex-wrap gap-4 text-sm text-gray-700">
          <label class="inline-flex items-center gap-2">
            <input type="checkbox" v-model="options.login"
                   class="rounded border-gray-300 text-blue-600 focus:ring-blue-200" />
            로그인 포함
          </label>
          <label class="inline-flex items-center gap-2">
            <input type="checkbox" v-model="options.autoClick"
                   class="rounded border-gray-300 text-blue-600 focus:ring-blue-200" />
            버튼 자동 클릭
          </label>
          <label class="inline-flex items-center gap-2">
            <input type="checkbox" v-model="options.scroll"
                   class="rounded border-gray-300 text-blue-600 focus:ring-blue-200" />
            스크롤 캡쳐
          </label>
        </section> -->

        <!-- 실행 -->
        <button
          @click="start"
          :disabled="loading"
          class="mt-6 inline-flex items-center justify-center rounded-lg
                 bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white
                 shadow-sm transition hover:bg-blue-500
                 disabled:cursor-not-allowed disabled:bg-blue-300">
          {{ loading ? '분석 중...' : '분석 시작' }}
        </button>

        <!-- 진행 상태 -->
        <div class="mt-6">
          <ProgressStatus v-if="loading" :step="step" />
        </div>

        <!-- 결과 -->
        <div v-if="result" class="mt-8">
          <ManualPreview :data="result" />
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
import ProgressStatus from '@/views/manual/ProgressStatus.vue'
import ManualPreview from '@/views/manual/ManualPreview.vue'
import Commodal from '@/components/modal/Commodal.vue'


//state
const url = ref('')
const loading = ref(false)
const step = ref('')
const result = ref<any>(null)

const showAlertModal = ref<boolean>(false)
const alertMessage = ref<string>('')

const openAlert = (message: string) => {
  alertMessage.value = message
  showAlertModal.value = true
}

const closeAlert = () => {
  showAlertModal.value = false
}


//progress
const progressTextMap: Record<string, string> = {
  PAGE_LOAD: '페이지 로딩 중...',
  DOM_ANALYZE: '화면 분석 중...',
  SCREEN_CAPTURE: '화면 캡쳐 중...',
  DESCRIPTION: '설명 생성 중...',
  ERROR: '오류 발생'
}

// 분석 시작 
const start = async () => {
  console.log('[Manual] start called')
  if (!url.value) {
    openAlert('URL을 입력하세요')
    return
  }

  loading.value = true
  step.value = '요청 전송 중...'
  result.value = null

  try {
    const res = await fetch('/api/manual/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: url.value
      })
    })

    console.log('[Manual] analyze status', res.status)

    if (!res.ok) {
      throw new Error(`요청 실패 (${res.status})`)
    }

    const payload = await res.json()
    console.log('[Manual] analyze payload', payload)
    if (!payload?.taskId) {
      throw new Error('작업 ID를 받지 못했습니다.')
    }

    console.log('[Manual] connectSSE call', payload.taskId)
    connectSSE(payload.taskId)
  } catch (error) {
    console.error(error)
    step.value = '오류 발생'
    loading.value = false
  }
}

//sse

const connectSSE = (taskId: string) => {
  console.log('[Manual] connectSSE enter', taskId)
  const eventSource = new EventSource(`/api/manual/progress/${taskId}`)

  eventSource.addEventListener('open', () => {
    console.log('SSE OPENED')
    step.value = '분석 연결 중...'
  })

  // 진행 상태
  eventSource.addEventListener('progress', (e: MessageEvent) => {
    console.log('[Manual] progress', e.data)
    step.value = progressTextMap[e.data] ?? e.data
  })

  // 완료 + 결과 수신
  eventSource.addEventListener('done', (e: MessageEvent) => {
    console.log('DONE EVENT RECEIVED', e.data)
    result.value = JSON.parse(e.data)
    step.value = ''         
    loading.value = false
    eventSource.close()
  })

  // 에러
  eventSource.onerror = (e) => {
    console.log('ERRRRRRR', e)
    step.value = '오류 발생'
    loading.value = false
    eventSource.close()
  }
}
</script>
