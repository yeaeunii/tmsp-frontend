import { createWebHistory, createRouter } from "vue-router";
import { useUserStore } from '@/store/user'

const routes = [
  {
    path: '/',
    name: 'Main',
    component: () => import('@/views/Main.vue'),
  },
  {
    path: '/board',
    name: 'Board',
    component: () => import('@/views/board/Board.vue'),
  },
  {
    path: '/post',
    name: 'Post',
    component: () => import('@/views/board/Post.vue'),
  },
  {
    path: '/board/:id',
    name: 'BoardDetail',
    component: () => import('@/views/board/BoardDetail.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    meta: { guestOnly: true },
    component: () => import('@/views/login/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    meta: { guestOnly: true },
    component: () => import('@/views/login/Register.vue'),
  },
  {
    path: '/newsletter',
    name: 'Newsletter',
    component: () => import('@/views/newsletter/Newsletter.vue'),
  },
  {
    path: '/newsletter/:id',
    name: 'NewsletterDetail',
    component: () => import('@/views/newsletter/NewsletterDetail.vue'),
  },
  {
    path: '/newsletter/write',
    name: 'NewsletterWrite',
    meta: { loginOnly: true },
    component: () => import('@/views/newsletter/NewsletterWrite.vue'),
  },
  {
    path: '/manual',
    name: 'Manual',
    meta: { loginOnly: true },
    component: () => import('@/views/manual/Manual.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {

  const userStore = useUserStore()


  if (!userStore.initialized) {
    await userStore.hydrateFromSession()
  }

  if (!userStore.isLogin && to.meta.loginOnly) {

    window.dispatchEvent(
      new CustomEvent('invalid-access', {
        detail: { message: '로그인이 필요한 페이지 입니다.' },
      })
    )
    return {
      path: '/login',
      query: { redirect: to.fullPath, message: '로그인이 필요한 페이지 입니다.' },
    }
  }

  if (userStore.isLogin && to.meta.guestOnly) {
    
    window.dispatchEvent(
      new CustomEvent('invalid-access', {
        detail: { message: '이미 로그인된 상태입니다.' },
      })
    )
    return '/'
  }

})

export default router
