<template>
  <div class="manual space-y-12">

    <!-- 매뉴얼 제목 -->
    <section class="border-b pb-6">
      <h1 class="text-2xl font-bold text-gray-900">
        자동 생성 사용자 매뉴얼
      </h1>
      <p class="mt-2 text-sm text-gray-500">
        시스템이 분석한 화면과 기능 설명입니다.
      </p>
    </section>

    <!-- 화면 단위 -->
    <section
      v-for="screen in data.screens"
      :key="screen.state"
      class="space-y-6"
    >
      <header>
        <h2 class="text-xl font-semibold text-gray-800">
          {{ screen.state + 1 }}. 화면 {{ screen.state + 1 }}
        </h2>
      </header>

      <!-- 스크린샷 -->
      <div class="rounded-lg border bg-gray-50 p-4">
        <img
          :src="screen.image"
          alt="screen capture"
          class="mx-auto max-h-[900px] rounded shadow"
        />
      </div>

      <!-- 기능 설명 -->
      <div class="space-y-3">
        <h3 class="text-lg font-medium text-gray-700">
          주요 기능
        </h3>

        <ol class="list-decimal space-y-2 pl-5 text-sm text-gray-700">
          <li
            v-for="el in screen.elements"
            :key="el.index"
          >
            <strong>{{ el.label }}</strong> :
            {{ el.description }}

            <span
              v-if="el.confidence !== 'high'"
              class="ml-2 text-xs text-orange-500"
            >
              (추정)
            </span>
          </li>
        </ol>
      </div>
    </section>

    <!-- 다운로드 -->
    <div class="mt-10 flex gap-4">
      <button
        @click="downloadHtml"
        class="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
      >
        HTML 다운로드
      </button>

      <button
        @click="downloadPdf"
        class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
      >
        PDF 다운로드
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
/* ===== DTO 타입 정의 ===== */

interface ElementDto {
  index: number
  label: string
  description: string
  confidence: 'high' | 'medium' | 'low'
}

interface ScreenDto {
  state: number        
  image: string
  elements: ElementDto[]
}

interface ManualAnalyzeResponse {
  screens: ScreenDto[]
}

/* ===== Props ===== */

const props = defineProps<{
  data: ManualAnalyzeResponse
}>()

/* ===== 다운로드 ===== */

const downloadFile = async (type: 'html' | 'pdf') => {
  const res = await fetch(`/api/manual/export/${type}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(props.data)
  })

  const blob = await res.blob()
  const url = window.URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `manual.${type}`
  a.click()

  window.URL.revokeObjectURL(url)
}

const downloadHtml = () => downloadFile('html')
const downloadPdf = () => downloadFile('pdf')
</script>
