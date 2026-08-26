
<template>
  <!-- 路由挂载点:所有路由组件都会渲染到这里 -->
  <router-view></router-view>
  <!-- 全局 Toast 容器(所有页面共享) -->
  <ToastContainer ref="toastRef" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ToastContainer from '@/components/ToastContainer.vue'
import { setToastContainer } from '@/composables/useToast'

const toastRef = ref(null)

onMounted(() => {
  // 将 ToastContainer 实例注册到全局 composable
  setToastContainer(toastRef.value)
})
</script>

<style>
/* 可留空或添加全局样式 */
</style>