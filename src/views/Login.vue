<template>
  <div class="login-page">
    <!-- 左侧登录表单区域 -->
    <div class="login-form-container">
      <div class="form-content">
        <h1 class="title">芯记录—电子元器件分析平台</h1>
        <form class="login-form" @submit.prevent="handleLogin">
          <div class="input-group">
            <input 
              type="text" 
              placeholder="请输入账号" 
              class="input-field" 
              v-model="username"
              required
            />
          </div>
          <div class="input-group">
            <input 
              type="password" 
              placeholder="请输入密码" 
              class="input-field" 
              v-model="password"
              required
            />
          </div>
          <button type="submit" class="login-button" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>
      </div>
      <p class="copyright">2025 © 深圳市风菱电子有限公司</p>
    </div>
    
    <!-- 右侧图片区域 -->
    <div class="image-container">
      <img 
        src="../assets/images/login/satellite.png" 
        alt="卫星背景图" 
        class="satellite-img"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { API_BASE_URL } from '@/config'

const username = ref('')
const password = ref('')
const loading = ref(false)
const router = useRouter()

// 已登录用户访问登录页时，直接跳转到首页
onMounted(() => {
  if (localStorage.getItem('token')) {
    router.replace('/')
  }
})

const handleLogin = async () => {
  if (!username.value || !password.value) {
    alert('请输入账号和密码')
    return
  }

  if (loading.value) return
  loading.value = true

  try {
    const response = await axios.post(`${API_BASE_URL}/user/login`, {
      username: username.value,
      password: password.value
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const result = response.data
    if (result.code === 200 && result.data) {
      // 登录成功，保存用户信息
      localStorage.setItem('token', 'chip-power-token-' + Date.now())
      localStorage.setItem('userId', result.data.id)
      localStorage.setItem('username', result.data.username)
      localStorage.setItem('role', result.data.role)
      localStorage.setItem('lastLoginDate', result.data.last_login_date || '')
      localStorage.setItem('createTime', result.data.create_time || '')
      router.push('/')
    } else {
      alert(result.message || '登录失败')
    }
  } catch (error) {
    console.error('登录错误:', error)
    if (error.response) {
      // 服务器返回错误状态码
      if (error.response.status === 401) {
        alert('账号或密码错误')
      } else {
        alert(error.response.data?.message || `登录失败 (${error.response.status})`)
      }
    } else if (error.request) {
      // 请求发出但没有收到响应
      alert('无法连接到服务器，请检查服务是否启动')
    } else {
      alert('登录失败：' + error.message)
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.login-page {
  display: flex;
  width: 100vw;
  height: 100vh;
}

/* 左侧表单区域 */
.login-form-container {
  flex: 0 0 50%;
  height: 100%;
  background-color: #fff; /* 左侧白色背景 */
  display: flex;
  flex-direction: column; /* 垂直排列表单和版权信息 */
  justify-content: center;
  align-items: center;
  /* padding-left: 50px; */
  margin: 0;
}

.form-content {
  width: 100%;
  max-width: 420px;
  margin-top: 220px;
  margin-bottom: 60px;
}

.title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 40px;
  text-align: center;
}

/* 输入框样式 - 灰色边框，聚焦时为绿色 */
.input-field {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e0e0e0; /* 浅灰色边框 */
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
  margin: 25px; /* 输入框外部间距 */
}

.input-field:focus {
  outline: none;
  border-color: #009906; /* 聚焦时绿色边框 */
}

/* 登录按钮 - 黑色背景，hover时加深 */
.login-button {
  width: 100%;
  padding: 14px 0;
  background-color: #0F0101; /* 近黑色背景 */
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 25px; /* 按钮外部间距 */
}

.login-button:hover {
  background-color: #2d0a0a; /* 深黑色hover效果 */
}

.login-button:disabled {
  background-color: #666;
  cursor: not-allowed;
  opacity: 0.7;
}

/* 版权信息：位于左侧区域底部，距离底部28px */
.copyright {
  color: #3D3D3D;
  font-size: 25px;
  text-align: center;
  margin-top: auto; /* 推至底部 */
  margin-bottom: 28px;
}

/* 右侧图片区域 - 绿色背景 */
.image-container {
  flex: 0 0 50%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: #009906; /* 右侧绿色背景 */
}

.satellite-img {
  object-fit: cover;
  width: 100%;
  height: 100%;
  display: block;
  object-position: center;
}
</style>
    