import { ref } from 'vue'

// 全局 Toast 状态(单例)
const toastContainer = ref(null)

/**
 * 在 App.vue 中调用此函数,将 ToastContainer 组件引用传进来
 * 这样任何组件都能通过 useToast() 调用全局 Toast
 */
export const setToastContainer = (ref) => {
  toastContainer.value = ref
}

/**
 * 获取全局 Toast 控制对象
 * 在任何组件的 setup() 中调用即可
 * 
 * @example
 * import { useToast } from '@/composables/useToast'
 * const toast = useToast()
 * 
 * // 显示成功
 * toast.success('保存成功')
 * 
 * // 显示 loading,异步完成后关闭
 * const loadingToast = toast.loading('保存中...')
 * await someAsyncTask()
 * loadingToast.close()
 */
export const useToast = () => {
  const call = (method, ...args) => {
    if (!toastContainer.value) {
      console.warn('[useToast] ToastContainer 未初始化,请在 App.vue 中挂载 <ToastContainer> 并调用 setToastContainer()')
      return null
    }
    return toastContainer.value[method](...args)
  }

  return {
    show: (options) => call('show', options),
    success: (message, duration) => call('success', message, duration),
    error: (message, duration) => call('error', message, duration),
    warning: (message, duration) => call('warning', message, duration),
    info: (message, duration) => call('info', message, duration),
    loading: (message) => call('loading', message),
  }
}
