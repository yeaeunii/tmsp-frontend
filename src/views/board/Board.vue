<template>
  <div class="bg-gray-100 py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:mx-0">
        <h2 class="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
          게시판
        </h2>
      </div>

   <!-- 검색  -->
    <div class="mt-8 flex max-w-2xl flex-col gap-2 sm:flex-row sm:items-center">
      <select 
        v-model="searchType" 
        class="select select-bordered select-sm w-full focus:outline-none sm:w-24"
      >
        <option value="title">제목</option>
        <option value="content">내용</option>
        <option value="writer">작성자</option>
      </select>
      <label class="input input-sm w-full sm:w-64 sm:flex-1">
        <input 
          type="search" 
          v-model="searchQuery" 
          @keyup.enter="handleSearch"
          :placeholder="`${searchType === 'title' ? '제목' : searchType === 'content' ? '내용' : '작성자'}로 검색`"
        />
      </label>
      <button 
        @click="handleSearch"
        class="btn btn-sm w-full px-3 bg-pink-200 hover:bg-pink-300 border-pink-300 text-pink-900 sm:w-auto">
        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
      </button>
    </div>

      <!-- 로딩 -->
      <div v-if="loading" class="mt-10 text-center">
        <p class="text-gray-600">게시글을 불러오는 중...</p>
      </div>

      <!-- 에러 -->
      <div v-else-if="error" class="mt-10 text-center">
        <p class="text-red-600">오류가 발생했습니다: {{ error }}</p>
        <button @click="fetchPosts" class="mt-4 rounded-md bg-pink-600 px-4 py-2 text-white hover:bg-pink-700">
          다시 시도
        </button>
      </div>

      <!-- 게시글 목록 -->
      <div
        v-else-if="posts.length > 0"
        class="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-4 gap-y-6 sm:gap-y-8 border-t
        border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12"
      >
        <article
          v-for="post in posts"
          :key="post.id"
          @click="selectPost(post)"
          class="flex max-w-xl flex-col items-start justify-between bg-white p-4 rounded-lg hover:bg-pink-50 transition-colors border border-pink-200 cursor-pointer">
          
          <div class="flex items-center gap-x-4 text-xs">
            <time class="text-gray-500">
              {{ formatDate(post.updatedAt || post.createdAt) }}
            </time>
          </div>

          <div class="group relative grow">
            <h3
              class="mt-3 text-lg font-semibold text-gray-900 group-hover:text-pink-600">
              {{ post.title }}
            </h3>
            <p
              v-if="post.content"
              class="mt-5 line-clamp-3 text-sm text-gray-600">
              {{ post.content }}
            </p>
          </div>

          <div v-if="post.writer" class="mt-4 flex items-center gap-x-2">
            <span class="text-xs text-gray-500">
              작성자: {{ post.writer }}
            </span>
          </div>
        </article>
      </div>

      <!-- 게시글이 없을 때 -->
      <div v-else class="mt-10 text-center">
        <p class="text-gray-600">
          {{ searchQuery ? '검색 결과가 없습니다.' : '게시글이 없습니다.' }}
        </p>
      </div>
    </div>
  </div>

  <BoardDetail
    v-if="selectedPost"
    :post="selectedPost"
    @close="closePanel"
    @select ="fetchPosts"
    @updated="handleUpdated"
    @deleted="handleDeleted"
  />

  <!-- 플러스 버튼  -->
  <div class="fab fab-flower">
  <!-- a focusable div with tabindex is necessary to work on all browsers. role="button" is necessary for accessibility -->
  <div tabindex="0" role="button" class="btn btn-circle btn-lg bg-pink-200 hover:bg-pink-300 border-pink-300 text-pink-800">
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
  </div>

  <!-- Main Action button replaces the original button when FAB is open -->
  <button 
    @click="goToPost"
    class="fab-main-action btn btn-circle btn-lg bg-pink-600 hover:bg-pink-700 border-pink-700 text-white shadow-lg">
    <svg
      aria-label="New post"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      class="size-6"
    >
      <path
        fill-rule="evenodd"
        d="M11.013 2.513a1.75 1.75 0 0 1 2.475 2.474L6.226 12.25a2.751 2.751 0 0 1-.892.596l-2.047.848a.75.75 0 0 1-.98-.98l.848-2.047a2.75 2.75 0 0 1 .596-.892l7.262-7.261Z"
        clip-rule="evenodd"
      />
    </svg>
  </button>

  <!-- buttons that show up when FAB is open -->
  <button class="btn btn-circle btn-lg bg-pink-100 hover:bg-pink-200 border-pink-200 text-pink-700">
    <svg
      aria-label="New camera photo"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      class="size-6"
    >
      <path d="M9.5 8.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
      <path
        fill-rule="evenodd"
        d="M2.5 5A1.5 1.5 0 0 0 1 6.5v5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 13.5 5h-.879a1.5 1.5 0 0 1-1.06-.44l-1.122-1.12A1.5 1.5 0 0 0 9.38 3H6.62a1.5 1.5 0 0 0-1.06.44L4.439 4.56A1.5 1.5 0 0 1 3.38 5H2.5ZM11 8.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        clip-rule="evenodd"
      />
    </svg>
  </button>
  <button class="btn btn-circle btn-lg bg-pink-100 hover:bg-pink-200 border-pink-200 text-pink-700">
    <svg
      aria-label="New poll"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      class="size-6"
    >
      <path
        d="M3 4.75a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM6.25 3a.75.75 0 0 0 0 1.5h7a.75.75 0 0 0 0-1.5h-7ZM6.25 7.25a.75.75 0 0 0 0 1.5h7a.75.75 0 0 0 0-1.5h-7ZM6.25 11.5a.75.75 0 0 0 0 1.5h7a.75.75 0 0 0 0-1.5h-7ZM4 12.25a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM3 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
      />
    </svg>
  </button>
  <button class="btn btn-circle btn-lg bg-pink-100 hover:bg-pink-200 border-pink-200 text-pink-700">
    <svg
      aria-label="New gallery photo"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      class="size-6"
    >
      <path
        fill-rule="evenodd"
        d="M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Zm10.5 5.707a.5.5 0 0 0-.146-.353l-1-1a.5.5 0 0 0-.708 0L9.354 9.646a.5.5 0 0 1-.708 0L6.354 7.354a.5.5 0 0 0-.708 0l-2 2a.5.5 0 0 0-.146.353V12a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5V9.707ZM12 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
        clip-rule="evenodd"
      />
    </svg>
  </button>
  <button class="btn btn-circle btn-lg bg-pink-100 hover:bg-pink-200 border-pink-200 text-pink-700">
    <svg
      aria-label="New voice"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      class="size-6"
    >
      <path d="M8 1a2 2 0 0 0-2 2v4a2 2 0 1 0 4 0V3a2 2 0 0 0-2-2Z" />
      <path
        d="M4.5 7A.75.75 0 0 0 3 7a5.001 5.001 0 0 0 4.25 4.944V13.5h-1.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-1.5v-1.556A5.001 5.001 0 0 0 13 7a.75.75 0 0 0-1.5 0 3.5 3.5 0 1 1-7 0Z"
      />
    </svg>
  </button>
</div>
</template>





<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import BoardDetail from './BoardDetail.vue'

const router = useRouter()


// 게시글 타입 정의
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

const selectedPost = ref<Post | null>(null)

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


// 게시글 상세 보기
const selectPost = (post: Post) => {
  selectedPost.value = post
  // 패널이 열릴 때 body 스크롤 방지
  document.body.style.overflow = 'hidden'
}

//  게시글 상세 닫기
const closePanel = () => {
  selectedPost.value = null
  // 패널이 닫힐 때 body 스크롤 복원
  document.body.style.overflow = ''
}

const handleUpdated = (updatedPost: Post) => {
  const index = posts.value.findIndex((item) => item.id === updatedPost.id)
  if (index !== -1) {
    posts.value.splice(index, 1, updatedPost)
  } else {
    posts.value.unshift(updatedPost)
  }
  selectedPost.value = updatedPost
}

const handleDeleted = (id: Post['id']) => {
  posts.value = posts.value.filter((item) => item.id !== id)
  closePanel()
}

// 글작성 페이지로 이동
const goToPost = () => {
  router.push('/post')
}

// 
onUnmounted(() => {
  document.body.style.overflow = ''
})




</script>
