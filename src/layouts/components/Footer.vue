<template>
  <footer class="mt-auto bg-slate-900 text-slate-400">
    <div class="mx-auto max-w-[90rem] px-8 py-10 lg:px-12 lg:py-12">
      <div class="grid gap-8 border-b border-white/10 pb-8 md:grid-cols-[1fr_auto] md:items-start">
        <div class="max-w-md">
          <RouterLink to="/" class="mb-3 inline-block text-xl font-bold text-slate-100 hover:text-white md:text-2xl">
            TMS 포털
          </RouterLink>
          <p class="text-[0.9375rem] leading-relaxed text-slate-400 md:text-base">
            팀과 업무를 한눈에. 신뢰할 수 있는 협업 포털
          </p>
        </div>
        <nav class="flex flex-col gap-4 md:flex-row md:gap-8" aria-label="푸터 메뉴">
          <RouterLink to="/board" class="text-base font-medium text-slate-400 no-underline whitespace-nowrap hover:text-slate-100 md:text-[1.0625rem]">
            게시판
          </RouterLink>
          <RouterLink to="/newsletter" class="text-base font-medium text-slate-400 no-underline whitespace-nowrap hover:text-slate-100 md:text-[1.0625rem]">
            개발공유보드
          </RouterLink>
          <RouterLink to="/manual" class="text-base font-medium text-slate-400 no-underline whitespace-nowrap hover:text-slate-100 md:text-[1.0625rem]">
            매뉴얼
          </RouterLink>
        </nav>
      </div>

      <div class="grid gap-10 py-8 sm:grid-cols-2 sm:gap-16">
        <div class="max-w-sm">
          <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400 md:text-[0.9375rem]">
            TMS 포털
          </h3>
          <p class="text-[0.9375rem] leading-relaxed text-slate-300 md:text-base">
            팀 협업 및 문서 관리 포털<br />
            개발 문서, 테스트 기록, 일정을 한 곳에서 관리합니다.
          </p>
        </div>
        <div class="max-w-sm">
          <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400 md:text-[0.9375rem]">
            Contact
          </h3>
          <p class="text-[0.9375rem] leading-relaxed text-slate-300 md:text-base">
            TEL | EMAIL<br />
            문의 시 관리자에게 연락해 주세요.
          </p>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-8">
        <div class="flex gap-8">
          <a href="#" class="text-sm text-slate-400 no-underline hover:text-slate-300 md:text-[0.9375rem]">
            이용약관
          </a>
          <a href="#" class="text-sm text-slate-400 no-underline hover:text-slate-300 md:text-[0.9375rem]">
            개인정보처리방침
          </a>
        </div>
        <p class="text-[0.8125rem] text-slate-400 md:text-sm">
          © TMS Portal. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// TMS 포털 푸터 - Tailwind만 사용
</script>
