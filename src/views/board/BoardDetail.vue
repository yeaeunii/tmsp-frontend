<template>
  <div
    v-if="post"
    class="fixed inset-0 z-50 overflow-hidden"
    @click.self="emitClose">
    <!-- 배경  -->
    <div class="absolute inset-0 bg-black/40 transition-opacity"></div>

    <!-- 게시글 상세-->
    <div class="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto">
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
        <h2 class="text-2xl font-semibold text-gray-900"></h2>
        <button
          @click="emitClose"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="닫기버튼">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <div class="px-6 py-8">
        <!-- 게시글 제목 -->
        <h1 v-if="!isEditing" class="text-3xl font-bold text-gray-900 mb-4">
          {{ post.title }}
        </h1>
        <input
          v-else
          v-model="editForm.title"
          type="text"
          class="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 text-lg font-semibold text-gray-900 focus:border-pink-400 focus:ring-pink-300"
          placeholder="제목을 입력하세요"
        />

        <!-- 게시글 날짜 -->
        <div class="flex items-center gap-4 mb-6 text-sm text-gray-500">
          <time v-if="!isEditing">
            {{ formatDate(post.updatedAt || post.createdAt) }}
          </time>
          <span v-if="post.writer">
            작성자: {{ post.writer }}
          </span>

          <!-- 수정 /삭제  -->
          <div v-if="!isEditing" class="ml-auto text-gray-700">
            <div class="dropdown dropdown-end">
              <label tabindex="0" class="btn btn-circle btn-sm btn-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </label>

              <!-- 메뉴 -->
              <ul
                tabindex="0"
                class="dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-36">
                <li>
                  <button
                    @click="startEdit"
                    class="flex items-center gap-2"
                    :disabled="saveLoading">
                    수정하기
                  </button>
                </li>

                <li>
                  <button
                    @click="requestDelete"
                    class="flex items-center gap-2 text-red-500"
                    :disabled="deleteLoading">
                     삭제하기
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 mb-6"></div>
        
        <!--게시글 내용 -->
        <div class="prose max-w-none">
          <p v-if="!isEditing" class="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {{ post.content || '내용이 없습니다.' }}
          </p>
          <textarea
            v-else
            v-model="editForm.content"
            rows="10"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-pink-400 focus:ring-pink-300"
            placeholder="내용을 입력하세요"
          ></textarea>
        </div>

        <!-- 수정 시  버튼 -->
        <div v-if="isEditing" class="mt-6 flex items-center justify-end gap-3">
          <button
            @click="cancelEdit"
            class="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            :disabled="saveLoading">
            취소
          </button>
          <button
            @click="saveEdit"
            class="rounded-md bg-pink-500 px-6 py-2 text-sm font-semibold text-white hover:bg-pink-600 shadow-sm"
            :disabled="saveLoading">
            {{ saveLoading ? '저장 중' : '저장' }}
          </button>
        </div>

        <p v-if="errorMessage" class="mt-4 text-sm text-red-600">
          {{ errorMessage }}
        </p>
      </div>
    </div>
  </div>

  <PWModal
    :open="showPasswordModal"
    title="비밀번호 확인"
    confirm-text="확인"
    cancel-text="취소"
    :error-message="passwordError"
    @close="closePasswordModal"
    @confirm="confirmPassword"
  />

  <Commodal
    :open="showDeleteConfirm"
    title=""
    message="정말 삭제하시겠습니까?"
    :show-cancel="true"
    confirm-text="삭제"
    cancel-text="취소"
    @close="closeDeleteConfirm"
    @confirm="confirmDelete"
  />

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
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import PWModal from '@/components/modal/PWmodal.vue'
import Commodal from '@/components/modal/Commodal.vue'
import router from '@/router'


// 게시글 타입 정의
interface Post {
  id: number 
  title: string
  content?: string
  writer?: string
  boardPW?: string
  updatedAt?: string
  createdAt?: string
}

//선택 게시글 
const props = defineProps<{
  post: Post | null
}>()

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'updated', post: Post): void
  (event: 'deleted', id: Post['id']): void
  (event: 'select'): void
}>()

const post = computed(() => props.post)
const isEditing = ref<boolean>(false)
const saveLoading = ref<boolean>(false)
const deleteLoading = ref<boolean>(false)
const errorMessage = ref<string | null>(null)

const showPasswordModal = ref<boolean>(false)
const passwordError = ref<string | null>(null)
const passwordAction = ref<'edit' | 'delete' | null>(null)
const showDeleteConfirm = ref<boolean>(false)
const showAlertModal = ref<boolean>(false)
const alertMessage = ref<string>('')


//수정 폼
const editForm = ref({
  title: '',
  content: '',
})

//수정시 기존 게시글로 초기화 
const resetEditForm = () => {
  editForm.value = {
    title: post.value?.title ?? '',
    content: post.value?.content ?? '',
  }
  errorMessage.value = null
  isEditing.value = false
}


watch(
  () => props.post,
  (newPost) => {
    if (newPost) {
      resetEditForm()
    }
  },
  { immediate: true }
)

//게시글 닫기
const emitClose = () => {
  emit('close')
}


//수정 모달 닫기
const cancelEdit = () => {
  resetEditForm()
}

//수정 요청
const startEdit = () => {
  if (!post.value) return
  passwordError.value = null
  errorMessage.value = null
  passwordAction.value = 'edit'
  showPasswordModal.value = true
}


//수정 로직
const saveEdit = async () => {
  if (!post.value) return
  if (!editForm.value.title.trim() || !editForm.value.content.trim()) {
    errorMessage.value = '제목과 내용을 입력해주세요.'
    return
  }

  saveLoading.value = true
  errorMessage.value = null

  try {
    const response = await fetch(`/api/board/postmodify/${post.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: editForm.value.title,
        content: editForm.value.content,
      }),
    })

    if (!response.ok) {
      if (response.status === 404) {
        openAlert('게시글이 존재하지 않습니다.')
      } else if (response.status === 410) {
        openAlert('이미 삭제된 게시글입니다.')
        cancelEdit()
      } else {
        openAlert('알 수 없는 오류가 발생했습니다.')
      }
      return
    }

    let updatedPost: Post = {
      ...post.value,
      title: editForm.value.title,
      content: editForm.value.content,
    }

    emit('updated', updatedPost)
    
    isEditing.value = false

  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
  } finally {
    saveLoading.value = false
  }
}

//비밀번호 모달 닫기
const closePasswordModal = () => {
  showPasswordModal.value = false
  passwordAction.value = null
}

//비밀번호 검사
const confirmPassword = async (password: string) => {
  const currentPost = post.value
  if (!currentPost?.boardPW) {
    passwordError.value = '비밀번호가 설정되지 않았습니다.'
    return
  }
  if (password !== currentPost.boardPW) {
    passwordError.value = '비밀번호가 일치하지 않습니다.'
    return
  }
    showPasswordModal.value = false
    passwordError.value = null

  if (passwordAction.value === 'delete') {
    passwordAction.value = null
    showDeleteConfirm.value = true
    return
  }
  passwordAction.value = null
  isEditing.value = true
}

// 삭제 모달 닫기
const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false
}

const openAlert = (message: string) => {
  alertMessage.value = message
  showAlertModal.value = true
}

const closeAlert = () => {
  showAlertModal.value = false
  // debugger;
  await router.push({path: '/'});
  emit('select')
  emit('close')
}

//삭제 요청
const requestDelete = () => {
  if (!post.value) return
  passwordError.value = null
  errorMessage.value = null
  passwordAction.value = 'delete'
  showPasswordModal.value = true
}

//삭제 확인 모달
const confirmDelete = async () => {
  showDeleteConfirm.value = false
  await performDelete()
}

//삭제 로직
const performDelete = async () => {
  if (!post.value) return

  deleteLoading.value = true
  errorMessage.value = null

  try {
    const response = await fetch(`/api/board/postdelete/${post.value.id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      if (response.status === 404) {
        openAlert('게시글이 존재하지 않습니다.')
      } else if (response.status === 410) {
        openAlert('이미 삭제된 게시글입니다.')
        cancelEdit()
      } else {
        openAlert('알 수 없는 오류가 발생했습니다.')
      }
      return
    }
    emit('deleted', post.value.id)
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
  } finally {
    deleteLoading.value = false
  }
}



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

</script>
