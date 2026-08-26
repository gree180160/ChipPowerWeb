<template>
  <!-- 全局 Toast 容器(在 App.vue 中挂载一次即可) -->
  <toast
    v-for="item in toasts"
    :key="item.id"
    :visible="item.visible"
    :message="item.message"
    :type="item.type"
    :duration="item.duration"
    :icon="item.icon"
    :show-close="item.showClose"
    @update:visible="(v) => handleVisibleChange(item, v)"
    @close="() => handleClose(item)"
  />
</template>

<script setup>
import { ref } from 'vue'
import Toast from './Toast.vue'

const toasts = ref([])
let nextId = 1

const handleVisibleChange = (item, v) => {
  item.visible = v
  if (!v) {
    // 延迟移除,让退出动画播放完
    setTimeout(() => {
      const idx = toasts.value.findIndex(t => t.id === item.id)
      if (idx !== -1) toasts.value.splice(idx, 1)
    }, 300)
  }
}

const handleClose = (item) => {
  item.visible = false
}

/**
 * 显示 Toast
 * @param {Object|string} options - 配置对象或字符串(作为 message)
 * @param {string} options.message - 提示文字
 * @param {string} [options.type='info'] - 类型: success | error | warning | info | loading
 * @param {number} [options.duration=3000] - 显示时长(ms),0 表示不自动关闭
 * @param {string} [options.icon] - 图标类型(success/error/warning/info/loading)或自定义 class
 * @param {boolean} [options.showClose=false] - 是否显示关闭按钮
 * @returns {Object} 控制对象,可调用 .close() 手动关闭 loading toast
 */
const show = (options) => {
  const config = typeof options === 'string' ? { message: options } : { ...options }
  const id = nextId++
  const item = {
    id,
    message: config.message || '',
    type: config.type || 'info',
    duration: config.duration ?? 3000,
    icon: config.icon || config.type || '',
    showClose: config.showClose ?? false,
    visible: true,
  }
  toasts.value.push(item)
  return {
    id,
    close: () => {
      item.visible = false
    },
  }
}

// 快捷方法
const success = (message, duration) => show({ message, type: 'success', duration, icon: 'success' })
const error = (message, duration) => show({ message, type: 'error', duration, icon: 'error' })
const warning = (message, duration) => show({ message, type: 'warning', duration, icon: 'warning' })
const info = (message, duration) => show({ message, type: 'info', duration, icon: 'info' })

/**
 * 显示 loading Toast(不自动关闭,需手动调用返回对象的 .close())
 * @param {string} [message='加载中...'] - 提示文字
 * @returns {Object} 控制对象,调用 .close() 关闭
 */
const loading = (message = '加载中...') => {
  return show({ message, type: 'loading', duration: 0, icon: 'loading', showClose: false })
}

defineExpose({ show, success, error, warning, info, loading })
</script>
