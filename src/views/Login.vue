<template>
  <div class="login-page">
    <!-- 左侧登录表单区域 -->
    <div class="login-form-container">
      <div class="form-content">
        <h1 class="title">芯动力—电子元器件分析平台</h1>
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
          <button type="submit" class="login-button">登录</button>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const router = useRouter()

const testUsers = [
  { username: 'admin', password: 'Calcitrapa0228' },
  { username: 'river', password: 'Test1234' },
  { username: 'alex', password: 'Test1234' },
  { username: 'mark', password: 'Test1234' }
]

const handleLogin = () => {
  if (!username.value || !password.value) {
    alert('请输入账号和密码')
    return
  }
  const matched = testUsers.find(u => u.username === username.value && u.password === password.value)
  if (matched) {
    localStorage.setItem('token', 'valid-token')
    localStorage.setItem('username', matched.username)
    router.push('/')
  } else {
    alert('账号或密码错误，请使用测试账号登录')
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
    