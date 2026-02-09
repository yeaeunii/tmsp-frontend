<template>
  <div class="bg-gray-50 py-10 sm:py-12">
    <div class="mx-auto w-full max-w-5xl px-6 lg:px-8">
      <div class="mb-4">
      </div>
      <div class="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
        <button
          type="button"
          @click="goBack"
          class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
        >
          <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 18l-6-6 6-6" />
          </svg>
          목록으로
        </button>
      </div>

      <div v-if="loading" class="mt-10 text-center text-sm text-gray-500">
        게시물을 불러오는 중...
      </div>
      <div v-else-if="error" class="mt-10 text-center text-sm text-red-600">
        {{ error }}
      </div>
      <div v-else-if="item" class="w-full">
        <div class="border border-gray-200 bg-white">
          <div class="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 class="text-lg font-semibold text-gray-900">{{ item.title }}</h2>
          </div>
          <div class="flex flex-wrap items-center gap-4 px-6 py-3 text-sm text-gray-600">
            <span v-if="item.category" class="font-semibold text-gray-700">
              {{ item.category }}
            </span>
            <span v-if="item.writer">작성자 {{ item.writer }}</span>
            <span v-if="item.createdAt">작성일 {{ formatDate(item.createdAt) }}</span>
          </div>
          <div class="border-t border-gray-200 px-6 py-8 text-sm leading-7 text-gray-700 whitespace-pre-wrap">
            {{ item.description || '내용이 없습니다.' }}
          </div>
        </div>

        <div class="mt-8 border border-gray-200 bg-white">
          <div class="grid grid-cols-[120px_1fr] border-b border-gray-200">
            <div class="flex items-center justify-center bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700">
              첨부파일
            </div>
            <div class="px-4 py-3">
              <div v-if="downloadFiles.length === 0" class="text-sm text-gray-500">
                등록된 파일이 없습니다.
              </div>
              <div v-else class="flex flex-col gap-2">
                <a
                  v-for="file in downloadFiles"
                  :key="file.url"
                  :href="file.url"
                  :download="file.name"
                  class="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline">
                  <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
                  </svg>
                  {{ file.name }}
                </a>
              </div>
            </div>
          </div>
          <div class="p-6">
            <div v-if="imageUrls.length === 0" class="text-sm text-gray-500">
              첨부 이미지가 없습니다.
            </div>
            <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                v-for="(url, index) in imageUrls"
                :key="url"
                class="overflow-hidden rounded-xl border border-gray-200 bg-white" >
                <img :src="url" :alt="`${item.title}-${index + 1}`" class="h-64 w-full object-cover" />
                <div class="flex items-center justify-between px-4 py-3">
                  <span class="text-xs text-gray-500">첨부 이미지 {{ index + 1 }}</span>
                  <a
                    :href="url"
                    :download="`${safeTitle}-${index + 1}.jpg`"
                    class="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-900 hover:text-white">
                    다운로드
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="mt-10 text-center text-sm text-gray-500">
        게시물을 찾을 수 없습니다.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type NewsletterItem = {
  id: number
  category?: string
  title: string
  description?: string
  createdAt?: string
  updateAt?: string
  writer?: string
  image?: string
  images?: string[]
  fileUrl?: string
  fileName?: string
  attachments?: { name?: string; url?: string }[]
}

const route = useRoute()
const router = useRouter()

const item = ref<NewsletterItem | null>(null)
const loading = ref(false)
const error = ref('')

const formatDate = (dateString?: string): string => {
  if (!dateString) return '날짜 없음'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  } catch {
    return dateString
  }
}

const safeTitle = computed(() => (item.value?.title || 'attachment').replace(/[\\/:*?"<>|]/g, '-'))

const imageUrls = computed(() => {
  const urls: string[] = []
  if (item.value?.image) urls.push(item.value.image)
  if (Array.isArray(item.value?.images)) urls.push(...item.value.images)
  return Array.from(new Set(urls))
})

const downloadFiles = computed(() => {
  const files: { name: string; url: string }[] = []
  if (Array.isArray(item.value?.attachments)) {
    item.value.attachments.forEach((file: { name?: string; url?: string }, index: number) => {
      if (file.url) {
        files.push({
          url: file.url,
          name: file.name || `${safeTitle.value}-${index + 1}`,
        })
      }
    })
  }
  if (item.value?.fileUrl) {
    files.push({
      url: item.value.fileUrl,
      name: item.value.fileName || `${safeTitle.value}`,
    })
  }
  if (files.length === 0 && imageUrls.value.length > 0) {
    imageUrls.value.forEach((url, index) => {
      files.push({
        url,
        name: `${safeTitle.value}-${index + 1}.jpg`,
      })
    })
  }
  return files
})

const fetchNewsletter = async () => {
  loading.value = true
  error.value = ''
  item.value = null

  const id = Number(route.params.id)
  if (!Number.isFinite(id)) {
    error.value = '잘못된 주소입니다.'
    loading.value = false
    return
  }

  try {
    const response = await fetch('/api/newsletter/list')
    if (!response.ok) {
      throw new Error('목록 조회 실패')
    }
    const data = await response.json()
    const found = data.find((entry: NewsletterItem) => entry.id === id)
    if (!found) {
      error.value = '게시물을 찾을 수 없습니다.'
    } else {
      item.value = found
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '게시물 조회 오류'
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/newsletter')
}

watch(
  () => route.params.id,
  () => {
    fetchNewsletter()
  },
  { immediate: true }
)
</script>
