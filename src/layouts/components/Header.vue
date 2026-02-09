<template>
  <header class="relative z-20 bg-transparent border-b border-transparent shadow-none">
    <nav class="flex w-full items-center justify-between px-6 py-3 lg:px-8" aria-label="Global">
      <div class="flex lg:flex-1">
        <RouterLink to="/" class="-m-1.5 p-1.5 flex items-center">
          <span class="sr-only">메인</span>
          <span class="text-xl font-bold tracking-tight text-gray-900">TMS</span>
        </RouterLink>
      </div>
      <div class="flex lg:hidden">
        <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = true">
          <span class="sr-only">Open main menu</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <PopoverGroup class="hidden lg:flex lg:gap-x-12">
        <Popover class="relative" v-slot="{ close }">
          <PopoverButton class="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
            커뮤니티
            <ChevronDownIcon class="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
          </PopoverButton>
          <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-1" enter-to-class="translate-y-0" leave-active-class="transition ease-in duration-150" leave-from-class="translate-y-0" leave-to-class="opacity-0 translate-y-1">
            <PopoverPanel class="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
              <div class="p-4">
                <div v-for="item in products" :key="item.name" class="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50">
                  <div class="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                    <component :is="item.icon" class="h-6 w-6 text-gray-600 group-hover:text-blue-600" aria-hidden="true" />
                  </div>
                  <div class="flex-auto">
                    <RouterLink :to="item.href" class="block font-semibold text-gray-900" @click="close()">
                      {{ item.name }}
                      <span class="absolute inset-0"></span>
                    </RouterLink>
                    <p class="mt-1 text-gray-600">{{ item.description }}</p>
                  </div>
                </div>
              </div>
            </PopoverPanel>
          </transition>
        </Popover>
        <Popover class="relative" v-slot="{ close }">
          <PopoverButton class="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
            기능
            <ChevronDownIcon class="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
          </PopoverButton>
          <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-1" enter-to-class="translate-y-0" leave-active-class="transition ease-in duration-150" leave-from-class="translate-y-0" leave-to-class="opacity-0 translate-y-1">
            <PopoverPanel class="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
              <div class="p-4">
                <div v-for="item in features" :key="item.name" class="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50">
                  <div class="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                    <component :is="item.icon" class="h-6 w-6 text-gray-600 group-hover:text-blue-600" aria-hidden="true" />
                  </div>
                  <div class="flex-auto">
                    <RouterLink :to="item.href" class="block font-semibold text-gray-900" @click="close()">
                      {{ item.name }}
                      <span class="absolute inset-0"></span>
                    </RouterLink>
                    <p class="mt-1 text-gray-600">{{ item.description }}</p>
                  </div>
                </div>
              </div>
            </PopoverPanel>
          </transition>
        </Popover>
      </PopoverGroup>
      <div class="hidden lg:flex lg:flex-1 lg:justify-end">
        <div v-if="!userStore.isLogin">
          <RouterLink to="/login" class="text-sm font-semibold leading-6 text-gray-900">
            로그인 <span aria-hidden="true">&rarr;</span>
          </RouterLink>
        </div>
        <div v-else class="flex items-center gap-4 text-sm text-gray-900">
          <span>{{ userStore.username }}님 환영합니다</span>
          <button type="button" class="font-semibold text-red-600 hover:text-red-700" @click="logout">로그아웃</button>
        </div>
      </div>
    </nav>
    <Dialog class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
      <div class="fixed inset-0 z-50"></div>
      <DialogPanel class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div class="flex items-center justify-between">
          <RouterLink to="/" class="-m-1.5 p-1.5 flex items-center" @click="mobileMenuOpen = false">
            <span class="sr-only">메인</span>
            <span class="text-xl font-bold tracking-tight text-gray-900">TMS</span>
          </RouterLink>
          <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = false">
            <span class="sr-only">Close menu</span>
            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-gray-500/10">
            <div class="space-y-2 py-6">
              <Disclosure as="div" class="-mx-3" v-slot="{ open }">
                <DisclosureButton class="flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                  커뮤니티
                  <ChevronDownIcon :class="[open ? 'rotate-180' : '', 'h-5 w-5 flex-none']" aria-hidden="true" />
                </DisclosureButton>
                <DisclosurePanel class="mt-2 space-y-2">
                  <RouterLink
                    v-for="item in products"
                    :key="item.name"
                    :to="item.href"
                    class="block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    @click="mobileMenuOpen = false"
                  >
                    {{ item.name }}
                  </RouterLink>
                </DisclosurePanel>
              </Disclosure>
              <Disclosure as="div" class="-mx-3" v-slot="{ open }">
                <DisclosureButton class="flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                  기능
                  <ChevronDownIcon :class="[open ? 'rotate-180' : '', 'h-5 w-5 flex-none']" aria-hidden="true" />
                </DisclosureButton>
                <DisclosurePanel class="mt-2 space-y-2">
                  <RouterLink
                    v-for="item in features"
                    :key="item.name"
                    :to="item.href"
                    class="block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    @click="mobileMenuOpen = false"
                  >
                    {{ item.name }}
                  </RouterLink>
                </DisclosurePanel>
              </Disclosure>
            </div>
            <div v-if="!userStore.isLogin">
              <RouterLink to="/login" class="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold leading-7 text-gray-900 hover:bg-gray-50" @click="mobileMenuOpen = false">
                로그인
              </RouterLink>
            </div>
            <div v-else class="-mx-3 rounded-lg px-3 py-2.5 text-base/7 font-semibold leading-7 text-gray-900">
              <div class="mb-2 text-sm">{{ userStore.username }}님 환영합니다</div>
              <button type="button" class="text-red-600 font-semibold hover:text-red-700" @click="logout">로그아웃</button>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,} from '@headlessui/vue'
import {
  Bars3Icon,
  BellAlertIcon,
  ChatBubbleLeftRightIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,} from '@heroicons/vue/24/outline'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()


const products = [
  { name: '게시판', description: '공개 문서와 지식 기록을 확인합니다', href: '/board', icon: ChatBubbleLeftRightIcon },
  { name: '개발공유보드', description: 'UI/UX 이슈, 테스트 결과, QA 증빙, 장애 이슈를 공유합니다', href: '/newsletter', icon: BellAlertIcon }
]
const features = [
  { name: '매뉴얼 자동화', description: '업무 매뉴얼을 자동화합니다', href: '/manual', icon: WrenchScrewdriverIcon },
  { name: '지도', description: '여행계획 공유합니다', href: '/map', icon: WrenchScrewdriverIcon }
]

const mobileMenuOpen = ref(false)

// 로그아웃
const logout = async () => {

  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  })

  // 
  userStore.clearUser()

  router.push('/')
}

</script>
