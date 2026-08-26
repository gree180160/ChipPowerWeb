<template>
  <!-- 通用按钮组件:支持 loading 状态,loading 时显示 SVG 旋转图标 -->
  <button
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1"
    :class="[
      sizeClass,
      variantClass,
      (disabled || loading) ? 'cursor-not-allowed opacity-75' : 'cursor-pointer',
    ]"
    @click="handleClick"
  >
    <!-- Loading 图标(SVG,纯 CSS 旋转,不依赖图标库) -->
    <svg
      v-if="loading"
      class="animate-spin mr-1.5"
      :class="iconSizeClass"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
    <!-- 前置图标(非 loading 时) -->
    <i v-else-if="icon" :class="['mr-1.5', icon]"></i>
    <!-- 文本内容 -->
    <span>{{ loading ? loadingText : text }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 按钮文本
  text: { type: String, default: '' },
  // loading 状态
  loading: { type: Boolean, default: false },
  // loading 时显示的文本
  loadingText: { type: String, default: '处理中...' },
  // 按钮类型
  type: { type: String, default: 'button' },
  // 禁用状态
  disabled: { type: Boolean, default: false },
  // 变体:primary(蓝) | success(绿) | danger(红) | warning(橙) | default(白)
  variant: { type: String, default: 'primary' },
  // 尺寸:sm | md | lg
  size: { type: String, default: 'md' },
  // 前置图标 class(如 fa fa-edit)
  icon: { type: String, default: '' },
})

const emit = defineEmits(['click'])

const sizeClass = computed(() => {
  const map = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-1.5 text-sm',
    lg: 'px-5 py-2 text-base',
  }
  return map[props.size] || map.md
})

const iconSizeClass = computed(() => {
  const map = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-5 h-5' }
  return map[props.size] || map.md
})

const variantClass = computed(() => {
  // loading 时不改变配色,保持原变体颜色,确保图标颜色随配色走
  const map = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-400',
    default: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500',
  }
  return map[props.variant] || map.primary
})

const handleClick = (e) => {
  if (props.disabled || props.loading) return
  emit('click', e)
}
</script>
