<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 页面标题 -->
    <div class="bg-white shadow-sm py-6 px-6">
      <h1 class="text-xl font-semibold text-gray-900">个人信息管理</h1>
    </div>

    <!-- 主要内容区 -->
    <div class="max-w-3xl mx-auto px-6 py-8">
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <!-- 用户信息卡片 -->
        <div class="p-6 border-b border-gray-200">
          <div class="flex flex-col md:flex-row items-center">
            <!-- 用户头像 -->
            <div class="mb-6 md:mb-0 md:mr-8">
              <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm">
                <img 
                  :src="userInfo.avatar" 
                  :alt="`${userInfo.name}的头像`" 
                  class="w-full h-full object-cover"
                >
              </div>
            </div>
            
            <!-- 用户基本信息 -->
            <div class="text-center md:text-left">
              <h2 class="text-2xl font-semibold text-gray-900">{{ userInfo.name }}</h2>
              <p class="text-gray-500 mt-1">{{ userInfo.role }}</p>
              
              <div class="mt-4 space-y-2">
                <div class="flex items-center text-gray-600">
                  <i class="fa fa-envelope-o w-5 text-gray-400"></i>
                  <span class="ml-3">{{ userInfo.email }}</span>
                </div>
                <div class="flex items-center text-gray-600">
                  <i class="fa fa-clock-o w-5 text-gray-400"></i>
                  <span class="ml-3">最后登录: {{ userInfo.lastLogin }}</span>
                </div>
                <div class="flex items-center text-gray-600">
                  <i class="fa fa-calendar-o w-5 text-gray-400"></i>
                  <span class="ml-3">账户创建: {{ userInfo.createDate }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 操作按钮区域 -->
        <div class="p-6 bg-gray-50 flex justify-center space-x-4">
          <button 
            @click="handleChangePassword"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <i class="fa fa-lock mr-2"></i>
            修改密码
          </button>
          <button 
            @click="handleLogout"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <i class="fa fa-sign-out mr-2"></i>
            退出登录
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 用户信息数据
const userInfo = ref({
  avatar: '',
  name: '',
  role: '',
  email: '',
  lastLogin: '',
  createDate: ''
});

// 加载用户信息
const loadUserInfo = async () => {
  try {
    const response = await fetch('/UserInfo.json');
    if (!response.ok) {
      throw new Error('加载用户信息失败');
    }
    const data = await response.json();
    userInfo.value = data;
  } catch (error) {
    console.error('获取用户信息错误:', error);
    alert('无法加载用户信息，请稍后重试');
  }
};

// 处理修改密码
const handleChangePassword = () => {
  alert('修改密码功能将在后续版本中实现');
  // 实际项目中这里会打开修改密码的弹窗或路由到修改密码页面
};

// 处理退出登录
const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    // 实际项目中这里会调用退出登录的API
    alert('已成功退出登录');
    // 然后跳转到登录页
  }
};

// 页面加载时获取用户信息
onMounted(() => {
  loadUserInfo();
});
</script>

<style scoped>
/* 头像悬停效果 */
img {
  transition: transform 0.3s ease;
}

img:hover {
  transform: scale(1.05);
}

/* 按钮过渡效果 */
button {
  transition: all 0.2s ease;
}
</style>
    