import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: '/',
    name: 'Board',
    component: () => import('@/views/board/Board.vue'),
  },
  {
    path: '/post',
    name: 'Post',
    component: () => import('@/views/board/Post.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
