<template>
  <!-- 全局 Toast 容器(固定在屏幕顶部中央) -->
  <Transition name="toast-fade">
    <div
      v-if="visible"
      class="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-auto"
    >
      <div
        class="flex items-center px-4 py-3 rounded-lg shadow-lg border min-w-[200px] max-w-[400px]"
        :class="[
          typeClass,
          showClose ? 'pr-2' : '',
        ]"
        role="alert"
      >
        <!-- 图标(SVG,纯 CSS 实现,不依赖图标库) -->
        <svg
          v-if="icon"
          class="w-5 h-5 mr-2 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path v-if="icon === 'success'" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          <path v-else-if="icon === 'error'" stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          <path v-else-if="icon === 'warning'" stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <path v-else-if="icon === 'info'" stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <circle v-else-if="icon === 'loading'" class="animate-spin" cx="12" cy="12" r="10" stroke="none" />
        </svg>
        <!-- 文字内容 -->
        <span class="text-sm font-medium break-all">{{ message }}</span>
        <!-- 关闭按钮(可选) -->
        <button
          v-if="showClose"
          class="ml-2 w-5 h-5 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors"
          @click="close"
        >
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, watch } from 'vue'

const props = defineProps({
  // 是否显示(v-model 双向绑定)
  visible: { type: Boolean, default: false },
  // 提示文字
  message: { type: String, default: '' },
  // 类型:success | error | warning | info | loading
  type: { type: String, default: 'info' },
  // 显示时长(毫秒),0 表示不自动关闭
  duration: { type: Number, default: 3000 },
  // 图标类型(success/error/warning/info/loading)或自定义 class
  icon: { type: String, default: '' },
  // 是否显示关闭按钮
  showClose: { type: Boolean, default: false },
})

const emit = defineEmits(['update:visible', 'close'])

// 自动关闭计时器
let timer = null

const typeClass = computed(() => {
  const map = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    loading: 'bg-gray-50 text-gray-800 border-gray-200',
  }
  return map[props.type] || map.info
})

const close = () => {
  emit('update:visible', false)
  emit('close')
}

// 监听 visible,显示时启动自动关闭计时
watch(() => props.visible, (v) => {
  if (v) {
    // 清除旧计时器
    if (timer) { clearTimeout(timer); timer = null }
    // 非 loading 类型且 duration > 0 时自动关闭
    if (props.type !== 'loading' && props.duration > 0) {
      timer = setTimeout(() => {
        close()
      }, props.duration)
    }
  } else {
    // 关闭时清除计时器
    if (timer) { clearTimeout(timer); timer = null }
  }
})

// 如果初始就是 visible,也要启动计时
if (props.visible && props.type !== 'loading' && props.duration > 0) {
  timer = setTimeout(() => { close() }, props.duration)
}
</script>

<style scoped>
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}
.toast-fade-enter-from {
  opacity: 0;
  transform: translate(-50%, -12px);
}
.toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 12px);
}
</style>
