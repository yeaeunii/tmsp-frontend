<template>
  <div class="bg-gray-50 py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="text-center">
        <div class="mx-auto inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
          DEV SHARE BOARD
        </div>
        <h1 class="mt-4 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          개발공유보드
        </h1>
        <p class="mt-2 text-sm text-gray-500">
          UI/UX 이슈, 테스트 결과, QA 증빙, 장애 이슈를 공유합니다.
        </p>
      </div>

      <div class="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-for="category in categories"
            :key="category"
            type="button"
            @click="selectedCategory = category"
            :class="[
              'rounded-full px-4 py-2 text-sm font-semibold transition',
              selectedCategory === category
                ? 'bg-slate-900 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            ]"
          >
            {{ category }}
          </button>
        </div>

        <div class="flex w-full max-w-md items-center gap-2 lg:justify-end">
          <RouterLink
            v-if="userStore.isLogin"
            to="/newsletter/write"
            class="inline-flex h-12 w-12 flex-col items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-xs font-semibold text-blue-700 hover:bg-blue-100"
          >
            작<br />성
          </RouterLink>
          <div class="relative w-full">
            <input
              v-model="searchQuery"
              type="search"
              placeholder="검색"
              class="w-full rounded-full border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              v-if="searchQuery"
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              @click="searchQuery = ''"
              aria-label="검색어 지우기"
            >
              <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button
            class="inline-flex size-11 items-center justify-center rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
            aria-label="검색"
          >
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </button>
        </div>
      </div>

      <div
        class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <article
          v-for="item in items"
          :key="item.id"
          class="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div class="relative">
            <div
              class="h-48 w-full bg-gradient-to-br from-gray-100 via-white to-blue-50"
            >
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.title"
                class="h-full w-full object-cover"
              />
            </div>
            <span class="absolute left-4 top-4 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-gray-700">
              {{ item.category }}
            </span>
          </div>

          <div class="p-5">
            <div class="flex items-center gap-3 text-xs text-gray-500">
              <time>{{ item.createdAt }}</time>
            </div>
            <h3 class="mt-3 text-lg font-semibold text-gray-900 group-hover:text-blue-600">
              {{ item.title }}
            </h3>
            <p class="mt-2 line-clamp-2 text-sm text-gray-600">
              {{ item.description }}
            </p>
            <div class="mt-5 flex justify-end">
              <RouterLink
                :to="`/newsletter/${item.id}`"
                class="rounded-full bg-gray-100 px-4 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-900 hover:text-white"
              >
                더보기
              </RouterLink>
            </div>
          </div>
        </article>
      </div>

      <div v-if="loading" class="mt-10 text-center text-sm text-gray-500">
        불러오는 중...
      </div>
      <div v-else-if="errorMessage" class="mt-10 text-center text-sm text-blue-600">
        {{ errorMessage }}
      </div>
      <div v-else-if="items.length === 0" class="mt-10 text-center text-sm text-gray-500">
        검색 결과가 없습니다.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const categories = ['전체', 'UI/UX 이슈','QA 증빙', '인프라 / 설정 공유', '운영 이슈']
const selectedCategory = ref<string>('전체')
const searchQuery = ref<string>('')

type NewsletterItem = {
  id: number
  category: string
  title: string
  description: string
  createdAt: string
  image?: string
}

const items = ref<NewsletterItem[]>([])
const loading = ref(false)
const errorMessage = ref('')

const fetchNewsletters = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const params = new URLSearchParams()
    if (selectedCategory.value && selectedCategory.value !== '전체') {
      params.append('category', selectedCategory.value)
    }
    if (searchQuery.value.trim()) {
      params.append('keyword', searchQuery.value.trim())
    }

    const queryString = params.toString()
    const response = await fetch(`/api/newsletter/list${queryString ? `?${queryString}` : ''}`)

    if (!response.ok) {
      throw new Error('목록 조회 실패')
    }

    items.value = await response.json()
  } catch (error) {

    console.error(error)
    errorMessage.value = '목록을 불러오지 못했습니다.'
    
    items.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchNewsletters()
})

watch([selectedCategory, searchQuery], () => {
  fetchNewsletters()
})
</script>
