<template>
  <div class="bg-gray-50 py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="text-center">
        <div class="mx-auto inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
          BOARD
        </div>
        <h2 class="mt-4 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
         게시판
        </h2>
        <p class="mt-2 text-sm text-gray-500">
          최신 게시글과 소식을 확인하세요
        </p>
      </div>

      <!-- 검색/필터 -->
      <div class="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex w-full max-w-md items-center gap-2 lg:justify-end lg:order-2">
          <select
            v-model="searchType"
            class="w-28 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="title">제목</option>
            <option value="content">내용</option>
            <option value="writer">작성자</option>
          </select>
          <div class="relative w-full">
            <input
              type="search"
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              :placeholder="`${searchType === 'title' ? '제목' : searchType === 'content' ? '내용' : '작성자'}로 검색`"
              class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              v-if="searchQuery"
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              @click="searchQuery = ''"
            >
              <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button
            @click="handleSearch"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </button>
        </div>
        <div class="lg:order-1"></div>
      </div>

      <!-- 로딩 -->
      <div v-if="loading" class="mt-10 text-center">
        <p class="text-gray-600">게시글 불러오는 중...</p>
      </div>

      <!-- 에러 -->
      <div v-else-if="error" class="mt-10 text-center">
        <p class="text-red-600">오류가 발생했습니다: {{ error }}</p>
        <button @click="fetchPosts" class="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          다시 시도
        </button>
      </div>

      <!-- 게시글 목록 -->
      <div
        v-else-if="posts.length > 0"
        class="mt-10 overflow-hidden rounded-2xl border border-gray-200 bg-white"
      >
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
           <thead class="bg-gray-200 text-gray-800">
              <tr class="border-b border-gray-200">
                <th class="px-4 py-3 text-left font-semibold">번호</th>
                <th class="px-4 py-3 text-left font-semibold">제목</th>
                <th class="px-4 py-3 text-left font-semibold">작성자</th>
                <th class="px-4 py-3 text-left font-semibold">작성일</th>
              </tr>
            </thead>
            <tbody class="text-gray-700">
              <tr
                v-for="(post, index) in posts"
                :key="post.id"
                @click="goToDetail(post.id)"
                class="border-b border-gray-100 transition hover:bg-blue-50 cursor-pointer"
              >
                <td class="px-4 py-3">
                  {{ index + 1 }}
                </td>
                <td class="px-4 py-3 font-semibold text-gray-900">
                  <span class="line-clamp-1">{{ post.title }}</span>
                </td>
                <td class="px-4 py-3">
                  {{ post.writer || '-' }}
                </td>
                <td class="px-4 py-3">
                  {{ formatDate(post.updatedAt || post.createdAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 게시글이 없을 경우-->
      <div v-else class="mt-10 text-center">
        <p class="text-gray-600">
          {{ searchQuery ? '검색 결과가 없습니다.' : '게시글이 없습니다.' }}
        </p>
      </div>
    </div>
  </div>

  <!-- 플러스 버튼  -->
  <button
    @click="goToPost"
    class="fab btn btn-circle btn-lg bg-blue-600 hover:bg-blue-700 border-blue-700 text-white shadow-lg"
    aria-label="글 작성"
  >
    <svg
      aria-label="New"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      class="size-6"
    >
      <path
        d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z"
      />
    </svg>
  </button>
</template>





<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()


// 게시글 타입 정의ㅋㅋ
interface Post {
  id: number 
  title: string
  content?: string
  writer?: string
  updatedAt?: string
  createdAt?: string
}


const posts = ref<Post[]>([])
const loading = ref<boolean>(false)
const error = ref<string | null>(null)

const searchQuery = ref<string>('')

const searchType = ref<'title' | 'content' | 'writer'>('title')



// 게시글 조회 로직
const fetchPosts = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await fetch('/api/board/postselect', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    posts.value = data
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
    console.error('게시글 조회 오류:', err)
  } finally {
    loading.value = false
  }
}

// 날짜함수
const formatDate = (dateString?: string): string => {
  if (!dateString) return '날짜 없음'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}
// 검색함수
const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    await fetchPosts()
    return
  }

  loading.value = true
  error.value = null

  try {
    const params = new URLSearchParams({
      type: searchType.value,
      keyword: searchQuery.value.trim(),
    })

    const response = await fetch(`/api/board/postsearch?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    posts.value = data
  } catch (err) {
    error.value = err instanceof Error ? err.message : '검색 오류'
  } finally {
    loading.value = false
  }
}

// 게시글 select 
onMounted(() => {
  fetchPosts()
})


const goToDetail = (id: Post['id']) => {
  router.push(`/board/${id}`)
}

// 글작성 페이지로 이동
const goToPost = () => {
  router.push('/post')
}

</script>
