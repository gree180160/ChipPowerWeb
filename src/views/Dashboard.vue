<template>
    <div class="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <!-- 侧边栏导航 -->
      <aside class="w-64 bg-white dark:bg-gray-800 shadow-md z-10 hidden md:block">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 class="text-xl font-bold text-blue-600 dark:text-blue-400">芯片数据平台</h1>
        </div>
        
        <nav class="p-4">
          <ul class="space-y-1">
            <li>
              <router-link 
                to="/datacenter" 
                class="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                :class="isActive('/datacenter') ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : ''"
              >
                <i class="fa fa-database mr-3" aria-hidden="true"></i>
                数据中心
              </router-link>
            </li>
            
            <li>
              <router-link 
                to="/category" 
                class="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                :class="isActive('/category') ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : ''"
              >
                <i class="fa fa-tags mr-3" aria-hidden="true"></i>
                分类管理
              </router-link>
            </li>
            
            <!-- 物料中心 - 带有子菜单 -->
            <li>
              <button 
                @click="toggleSubmenu('material')"
                class="flex items-center justify-between w-full px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                :class="isActive('/material') ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : ''"
              >
                <div class="flex items-center">
                  <i class="fa fa-cubes mr-3" aria-hidden="true"></i>
                  物料中心
                </div>
                <i class="fa fa-chevron-down text-xs transition-transform" :class="{ 'rotate-180': submenus.material }" aria-hidden="true"></i>
              </button>
              
              <ul class="pl-10 mt-1 space-y-1" v-if="submenus.material">
                <li>
                  <router-link 
                    to="/material/model-info" 
                    class="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                    :class="isActive('/material/model-info') ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : ''"
                  >
                    型号基础信息
                  </router-link>
                </li>
              </ul>
            </li>
            
            <!-- 任务列表 - 带有子菜单 -->
            <li>
              <button 
                @click="toggleSubmenu('tasks')"
                class="flex items-center justify-between w-full px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                :class="isActive('/tasks') ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : ''"
              >
                <div class="flex items-center">
                  <i class="fa fa-list-alt mr-3" aria-hidden="true"></i>
                  任务列表
                </div>
                <i class="fa fa-chevron-down text-xs transition-transform" :class="{ 'rotate-180': submenus.tasks }" aria-hidden="true"></i>
              </button>
              
              <ul class="pl-10 mt-1 space-y-1" v-if="submenus.tasks">
                <li>
                  <router-link 
                    to="/tasks" 
                    class="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                    :class="isActive('/tasks') && !$route.params.id ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : ''"
                  >
                    任务列表首页
                  </router-link>
                </li>
                <!-- 任务详情是动态路由，这里不直接列出 -->
              </ul>
            </li>
            
            <li class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button 
                @click="logout"
                class="flex items-center w-full px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-600 dark:text-red-400"
              >
                <i class="fa fa-sign-out mr-3" aria-hidden="true"></i>
                退出登录
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      
      <!-- 主内容区域 -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- 顶部导航栏 -->
        <header class="bg-white dark:bg-gray-800 shadow-sm py-3 px-6 flex justify-between items-center">
          <button class="md:hidden" @click="toggleMobileMenu">
            <i class="fa fa-bars text-xl" aria-hidden="true"></i>
          </button>
          
          <div class="flex items-center space-x-4">
            <div class="relative">
              <i class="fa fa-bell-o text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer" aria-hidden="true"></i>
              <span class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
            </div>
            
            <div class="flex items-center">
              <img src="https://picsum.photos/id/1005/40/40" alt="用户头像" class="w-8 h-8 rounded-full mr-2">
              <span class="text-sm font-medium">管理员</span>
            </div>
          </div>
        </header>
        
        <!-- 面包屑导航 -->
        <div class="bg-gray-50 dark:bg-gray-800/50 py-2 px-6 border-b border-gray-200 dark:border-gray-700 text-sm">
          <div class="flex items-center">
            <router-link to="/" class="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">首页</router-link>
            <i class="fa fa-angle-right mx-2 text-gray-400 text-xs" aria-hidden="true"></i>
            
            <template v-for="(item, index) in $route.meta.breadcrumb" :key="index">
              <span v-if="index === $route.meta.breadcrumb.length - 1" class="text-gray-800 dark:text-gray-200">
                {{ item }}
              </span>
              <template v-else>
                <router-link 
                  :to="getBreadcrumbPath(index)" 
                  class="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {{ item }}
                </router-link>
                <i class="fa fa-angle-right mx-2 text-gray-400 text-xs" aria-hidden="true"></i>
              </template>
            </template>
          </div>
        </div>
        
        <!-- 页面内容 -->
        <main class="flex-1 overflow-y-auto p-6">
          <router-view />
        </main>
      </div>
      
      <!-- 移动端侧边栏 -->
      <div v-if="mobileMenuOpen" class="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" @click="toggleMobileMenu"></div>
      <div 
        v-if="mobileMenuOpen" 
        class="fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-lg z-30 md:hidden transform transition-transform"
      >
        <!-- 移动端侧边栏内容与桌面版相同 -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 class="text-xl font-bold text-blue-600 dark:text-blue-400">芯片数据平台</h1>
        </div>
        
        <nav class="p-4">
          <!-- 这里的导航内容与桌面版相同 -->
          <!-- 简化起见，省略重复代码 -->
        </nav>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  
  const router = useRouter()
  const route = useRoute()
  
  // 侧边栏子菜单状态
  const submenus = ref({
    material: false,
    tasks: false
  })
  
  // 移动端菜单状态
  const mobileMenuOpen = ref(false)
  
  // 切换子菜单
  const toggleSubmenu = (menu) => {
    submenus.value[menu] = !submenus.value[menu]
  }
  
  // 切换移动端菜单
  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value
  }
  
  // 检查路由是否激活
  const isActive = (path) => {
    return route.path.startsWith(path)
  }
  
  // 计算面包屑路径
  const getBreadcrumbPath = (index) => {
    const segments = route.path.split('/').filter(Boolean)
    return '/' + segments.slice(0, index + 1).join('/')
  }
  
  // 退出登录
  const logout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }
  
  // 初始化时根据当前路由展开对应的子菜单
  const initSubmenus = () => {
    if (route.path.startsWith('/material')) {
      submenus.value.material = true
    }
    if (route.path.startsWith('/tasks')) {
      submenus.value.tasks = true
    }
  }
  
  // 页面加载时初始化
  initSubmenus()
  </script>
  