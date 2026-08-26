<template>
  <!-- 通用分页控件:首页 / 上一页 / 当前页码 / 下一页 / 尾页 -->
  <div v-if="totalPages > 0" class="flex items-center justify-between flex-wrap gap-3">
    <!-- 左侧:数据统计 -->
    <div class="text-sm text-gray-600">
      共 <span class="font-semibold text-gray-900">{{ total }}</span> 条,
      第 <span class="font-semibold text-gray-900">{{ currentPage }}</span> / {{ totalPages }} 页
    </div>

    <!-- 右侧:分页按钮组 -->
    <div class="flex items-center space-x-1">
      <!-- 首页 -->
      <button
        class="px-3 py-1.5 text-sm border border-gray-300 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        :class="isFirstPage ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600'"
        :disabled="isFirstPage"
        :title="`首页(第 1 页)`"
        @click="goTo(1)"
      >
        <svg class="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11 19l-7-7 7-7M19 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- 上一页 -->
      <button
        class="px-3 py-1.5 text-sm border border-gray-300 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        :class="isFirstPage ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600'"
        :disabled="isFirstPage"
        title="上一页"
        @click="goTo(currentPage - 1)"
      >
        <svg class="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- 页码按钮组 -->
      <div class="flex items-center space-x-1">
        <template v-for="p in pageRange" :key="p">
          <!-- 省略号 -->
          <span v-if="p === '...'" class="px-2 text-gray-400 select-none">…</span>
          <!-- 页码 -->
          <button
            v-else
            class="min-w-[2rem] px-2 py-1.5 text-sm border rounded-md transition-colors"
            :class="p === currentPage
              ? 'bg-blue-600 text-white border-blue-600 font-semibold'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600'"
            :title="`第 ${p} 页`"
            @click="goTo(p)"
          >
            {{ p }}
          </button>
        </template>
      </div>

      <!-- 下一页 -->
      <button
        class="px-3 py-1.5 text-sm border border-gray-300 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        :class="isLastPage ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600'"
        :disabled="isLastPage"
        title="下一页"
        @click="goTo(currentPage + 1)"
      >
        <svg class="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- 尾页 -->
      <button
        class="px-3 py-1.5 text-sm border border-gray-300 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        :class="isLastPage ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600'"
        :disabled="isLastPage"
        :title="`尾页(第 ${totalPages} 页)`"
        @click="goTo(totalPages)"
      >
        <svg class="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
      </button>

      <!-- 跳转输入 -->
      <div v-if="showJumper" class="flex items-center space-x-1 ml-2">
        <span class="text-sm text-gray-500">跳至</span>
        <input
          v-model.number="jumpValue"
          type="number"
          min="1"
          :max="totalPages"
          class="w-14 px-2 py-1 text-sm border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
          @keyup.enter="handleJump"
        />
        <span class="text-sm text-gray-500">页</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  // 当前页(v-model)
  modelValue: { type: Number, default: 1 },
  // 总条数
  total: { type: Number, default: 0 },
  // 每页条数
  pageSize: { type: Number, default: 20 },
  // 是否显示跳转输入框
  showJumper: { type: Boolean, default: true },
  // 页码按钮最多显示个数(不含省略号)
  maxPageButtons: { type: Number, default: 5 },
})

const emit = defineEmits(['update:modelValue', 'change'])

const currentPage = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
const isFirstPage = computed(() => currentPage.value <= 1)
const isLastPage = computed(() => currentPage.value >= totalPages.value)

const jumpValue = ref('')
const handleJump = () => {
  const p = parseInt(jumpValue.value, 10)
  if (!isNaN(p) && p >= 1 && p <= totalPages.value) {
    goTo(p)
    jumpValue.value = ''
  }
}

// 页码范围(含省略号)
const pageRange = computed(() => {
  const range = []
  const maxShow = props.maxPageButtons
  let start = Math.max(1, currentPage.value - Math.floor(maxShow / 2))
  let end = start + maxShow - 1
  if (end > totalPages.value) {
    end = totalPages.value
    start = Math.max(1, end - maxShow + 1)
  }
  // 首页省略
  if (start > 1) {
    range.push(1)
    if (start > 2) range.push('...')
  }
  for (let i = start; i <= end; i++) {
    if (i !== 1 && i !== totalPages.value) range.push(i)
  }
  // 尾页省略
  if (end < totalPages.value) {
    if (end < totalPages.value - 1) range.push('...')
    range.push(totalPages.value)
  }
  return range
})

const goTo = (page) => {
  const target = Math.max(1, Math.min(totalPages.value, page))
  if (target !== currentPage.value) {
    currentPage.value = target
    emit('change', target)
  }
}
</script>
