<template>
  <!-- 登录弹窗:用户未登录时点击收藏按钮触发 -->
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
    <!-- 遮罩 -->
    <div class="absolute inset-0 bg-black/50" @click="onCancel"></div>
    <!-- 弹窗主体 -->
    <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
      <!-- 头部 -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <i class="fa fa-sign-in text-blue-600 mr-2"></i>请先登录
        </h3>
        <button class="text-gray-400 hover:text-gray-600 text-xl" @click="onCancel" aria-label="关闭">
          <i class="fa fa-times"></i>
        </button>
      </div>

      <!-- 表单 -->
      <div class="px-6 py-5 space-y-4">
        <p class="text-sm text-gray-500">登录后即可收藏 PPN,查看和管理你的关注列表</p>
        <div>
          <label class="block text-sm text-gray-700 mb-1">账号</label>
          <input
            v-model="username"
            type="text"
            placeholder="请输入账号"
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            @keyup.enter="handleLogin"
          />
        </div>
        <div>
          <label class="block text-sm text-gray-700 mb-1">密码</label>
          <input
            v-model="password"
            type="password"
            placeholder="请输入密码"
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            @keyup.enter="handleLogin"
          />
        </div>
        <div v-if="errMsg" class="text-sm text-red-600 flex items-center">
          <i class="fa fa-exclamation-circle mr-1"></i>{{ errMsg }}
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="flex items-center justify-end gap-2 px-6 py-3 bg-gray-50 border-t border-gray-200">
        <button
          class="px-4 py-1.5 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-100"
          @click="onCancel"
          :disabled="loading"
        >取消</button>
        <button
          class="px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center"
          :disabled="loading || !username || !password"
          @click="handleLogin"
        >
          <svg v-if="loading" class="animate-spin mr-1.5 w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <i v-else class="fa fa-sign-in mr-1.5"></i>
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

// props: visible 控制显示; emits: close(取消) / success(登录成功)
const props = defineProps({
  visible: { type: Boolean, default: false },
})
const emit = defineEmits(['close', 'success'])

import { API_BASE_URL } from '@/config'

const username = ref('')
const password = ref('')
const loading = ref(false)
const errMsg = ref('')

const handleLogin = async () => {
  if (!username.value || !password.value) {
    errMsg.value = '请输入账号和密码'
    return
  }
  if (loading.value) return
  loading.value = true
  errMsg.value = ''
  try {
    const response = await axios.post(`${API_BASE_URL}/user/login`, {
      username: username.value,
      password: password.value,
    }, { timeout: 10000, headers: { 'Content-Type': 'application/json' } })

    const result = response.data
    if (result.code === 200 && result.data) {
      // 写入 localStorage (与 Login.vue 一致)
      localStorage.setItem('token', 'chip-power-token-' + Date.now())
      localStorage.setItem('userId', result.data.id)
      localStorage.setItem('username', result.data.username)
      localStorage.setItem('role', result.data.role)
      localStorage.setItem('lastLoginDate', result.data.last_login_date || '')
      localStorage.setItem('createTime', result.data.create_time || '')
      // 通知父组件登录成功
      emit('success', result.data)
      // 重置表单
      username.value = ''
      password.value = ''
    } else {
      errMsg.value = result.message || '登录失败'
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        errMsg.value = '账号或密码错误'
      } else {
        errMsg.value = error.response.data?.message || `登录失败 (${error.response.status})`
      }
    } else if (error.request) {
      errMsg.value = '无法连接到服务器,请检查服务是否启动'
    } else {
      errMsg.value = '登录失败:' + error.message
    }
  } finally {
    loading.value = false
  }
}

const onCancel = () => {
  if (loading.value) return
  emit('close')
}
</script>
