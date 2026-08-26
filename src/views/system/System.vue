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
            <!-- 用户头像(系统默认假人头) -->
            <div class="mb-6 md:mb-0 md:mr-8">
              <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-200 shadow-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <!-- 系统默认假人头头像 (SVG) -->
                <svg class="w-3/5 h-3/5 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <!-- 组件测试入口(仅开发模式可见,生产环境构建后不渲染) -->
              <div v-if="isDev" class="mt-3 text-center">
                <a
                  href="/test-components.html"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 border border-indigo-200 transition-colors"
                  title="通用组件测试页(仅开发环境可见)"
                >
                  <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  组件测试页
                </a>
              </div>
            </div>

            <!-- 用户基本信息 -->
            <div class="text-center md:text-left">
              <h2 class="text-2xl font-semibold text-blue-700">{{ userInfo.username }}</h2>
              <p class="text-emerald-600 mt-1 font-medium">{{ roleLabel }}</p>

              <div class="mt-4 space-y-2">
                <div class="flex items-center text-gray-600">
                  <i class="fa fa-user-o w-5 text-gray-400"></i>
                  <span class="ml-3">用户ID: {{ userInfo.id }}</span>
                </div>
                <div class="flex items-center text-gray-600">
                  <i class="fa fa-clock-o w-5 text-gray-400"></i>
                  <span class="ml-3">最后登录: {{ userInfo.lastLoginDate || '-' }}</span>
                </div>
                <div class="flex items-center text-gray-600">
                  <i class="fa fa-calendar-plus-o w-5 text-gray-400"></i>
                  <span class="ml-3">账户创建: {{ userInfo.createTime || '-' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按钮区域 -->
        <div class="p-6 bg-gray-50 flex justify-center space-x-4">
          <button
            disabled
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-400 bg-gray-200 cursor-not-allowed"
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8001/api/data';
const router = useRouter();

// 是否为开发模式(生产环境构建后为 false,测试页入口不渲染)
const isDev = import.meta.env.DEV;

// 用户信息数据
const userInfo = ref({
  id: '',
  username: '',
  role: '',
  lastLoginDate: '',
  createTime: ''
});

// 角色 code → 文本映射
const roleMap = {
  '0': '管理员',
  '1': '普通用户'
};
const roleLabel = computed(() => roleMap[userInfo.value.role] || '未知');

// 日期格式化(处理多种可能的格式)
const formatDate = (s) => {
  if (!s) return '';
  // 处理无效日期占位符
  if (String(s).startsWith('0000-00-00')) return '';
  // 处理 RFC 格式(如 "Wed, 19 Aug 2026 15:27:45 GMT")
  if (typeof s === 'string' && s.includes(',')) {
    const d = new Date(s);
    if (!isNaN(d)) {
      const pad = n => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }
  }
  // 已经是 YYYY-MM-DD HH:MM:SS 格式或 datetime 对象,直接取前19位
  return String(s).slice(0, 19);
};

// 加载用户信息:先从 localStorage 取,缺失时 fallback 到 service
const loadUserInfo = async () => {
  // 1. 先从 localStorage 读登录时保存的信息
  userInfo.value = {
    id: localStorage.getItem('userId') || '',
    username: localStorage.getItem('username') || '',
    role: localStorage.getItem('role') || '',
    lastLoginDate: formatDate(localStorage.getItem('lastLoginDate') || ''),
    createTime: formatDate(localStorage.getItem('createTime') || '')
  };

  // 2. 如果 lastLoginDate 或 createTime 缺失,从 service 拉取补全
  if (!userInfo.value.lastLoginDate || !userInfo.value.createTime) {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;
      const resp = await axios.get(`${API_BASE_URL}/user/read`, { timeout: 10000 });
      if (resp.data?.code === 200) {
        const rows = resp.data.data || [];
        // user/read 返回二维数组,列顺序: id, username, password, role, last_login_date, create_time
        const row = rows.find(r => String(r[0]) === String(userId));
        if (row) {
          if (!userInfo.value.lastLoginDate) {
            userInfo.value.lastLoginDate = formatDate(row[4]);
            localStorage.setItem('lastLoginDate', userInfo.value.lastLoginDate);
          }
          if (!userInfo.value.createTime) {
            userInfo.value.createTime = formatDate(row[5]);
            localStorage.setItem('createTime', userInfo.value.createTime);
          }
        }
      }
    } catch (e) {
      console.error('从 service 拉取用户信息失败:', e);
    }
  }
};

// 处理修改密码(按钮已禁用)
const handleChangePassword = () => {
  // 按钮已 disabled,此处不会触发
};

// 处理退出登录
const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('lastLoginDate');
    localStorage.removeItem('createTime');
    router.push('/login');
  }
};

// 页面加载时获取用户信息
onMounted(() => {
  loadUserInfo();
});
</script>

<style scoped>
/* 头像悬停效果 */
.rounded-full:hover svg {
  transform: scale(1.08);
  transition: transform 0.3s ease;
}

/* 按钮过渡效果 */
button {
  transition: all 0.2s ease;
}

/* 禁用按钮样式 */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
