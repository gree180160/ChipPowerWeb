<template>
  <!-- 通用页面刷新 loading:覆盖层 + 居中旋转图标 + 文字 -->
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm"
    :class="overlayClass"
  >
    <div class="flex flex-col items-center">
      <!-- 旋转加载图标(SVG,纯 CSS 动画) -->
      <svg
        class="animate-spin text-blue-600"
        :class="sizeClass"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <!-- 加载文字 -->
      <p v-if="text" class="mt-3 text-sm font-medium" :class="textClass">{{ text }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 是否显示
  visible: { type: Boolean, default: false },
  // 提示文字
  text: { type: String, default: '加载中...' },
  // 图标尺寸:sm | md | lg
  size: { type: String, default: 'md' },
  // 覆盖层范围:full(整页) | local(父容器相对定位)
  scope: { type: String, default: 'full' },
  // 文字颜色
  textColor: { type: String, default: 'text-gray-600' },
})

const sizeClass = computed(() => {
  const map = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-14 h-14' }
  return map[props.size] || map.md
})

// local 模式:相对父容器定位(父容器需 position: relative)
const overlayClass = computed(() => {
  return props.scope === 'local' ? 'absolute' : 'fixed'
})

const textClass = computed(() => props.textColor)
</script>
