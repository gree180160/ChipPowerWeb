<template>
  <div class="flex h-screen w-screen bg-gray-50">
    <!-- 左侧导航栏 -->
    <div class="w-64 bg-white border-r border-gray-200 h-full">
      <!-- 顶部Logo -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center">
          <i class="fa fa-microchip text-green-600 text-3xl mr-2"></i>
          <span class="text-2xl font-semibold text-gray-800 ml-5">芯动力</span>
        </div>
      </div>
      
      <!-- 导航菜单 -->
      <nav class="py-4">
        <ul class="space-y-1 px-2">
          <!-- 数据中心 -->
          <li>
            <router-link 
              to="/datacenter"
              class="flex items-center px-3 py-2 rounded-md text-sm"
              :class="isActive('/datacenter') ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'"
            >
              <i class="fa fa-server mr-3"></i>
              数据中心
            </router-link>
          </li>
          
          <!-- 物料管理（可展开） -->
          <li>
            <button 
              class="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
              @click="toggleSubmenu('material')"
            >
              <div class="flex items-center">
                <i class="fa fa-cubes mr-3"></i>
                物料管理
              </div>
              <i 
                class="fa fa-chevron-down w-4 h-4 transition-transform duration-200" 
                :class="{ 'rotate-180': submenuOpen?.material }"
              ></i>
            </button>
            <ul class="ml-6 mt-1 space-y-1" v-if="submenuOpen?.material">
              <li>
                <router-link 
                  to="/category"
                  class="block px-3 py-2 rounded-md text-sm"
                  :class="isActive('/category') ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'"
                >
                  <i class="fa fa-tags mr-2"></i>分类管理
                </router-link>
              </li>
              <li>
                <router-link 
                  to="/material"
                  class="block px-3 py-2 rounded-md text-sm"
                  :class="isActive('/material') ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'"
                >
                  <i class="fa fa-cube mr-2"></i>物料中心
                </router-link>
              </li>
            </ul>
          </li>
          
          <!-- 分析管理（可展开） -->
          <li>
            <button 
              class="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
              @click="toggleSubmenu('analysis')"
            >
              <div class="flex items-center">
                <i class="fa fa-chart-line mr-3"></i>
                分析管理
              </div>
              <i 
                class="fa fa-chevron-down w-4 h-4 transition-transform duration-200" 
                :class="{ 'rotate-180': submenuOpen?.analysis }"
              ></i>
            </button>
            <ul class="ml-6 mt-1 space-y-1" v-if="submenuOpen?.analysis">
              <li>
                <router-link 
                  to="/analysis/task"
                  class="block px-3 py-2 rounded-md text-sm"
                  :class="isActive('/analysis/task') ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'"
                >
                  <i class="fa fa-tasks mr-2"></i>任务管理
                </router-link>
              </li>
              <li>
                <router-link 
                  to="/analysis/query"
                  class="block px-3 py-2 rounded-md text-sm"
                  :class="isActive('/analysis/query') ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'"
                >
                  <i class="fa fa-search mr-2"></i>分析查询
                </router-link>
              </li>
            </ul>
          </li>
          
          <!-- 监控管理（可展开） -->
          <li>
            <button 
              class="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
              @click="toggleSubmenu('monitor')"
            >
              <div class="flex items-center">
                <i class="fa fa-eye mr-3"></i>
                监控管理
              </div>
              <i 
                class="fa fa-chevron-down w-4 h-4 transition-transform duration-200" 
                :class="{ 'rotate-180': submenuOpen?.monitor }"
              ></i>
            </button>
            <ul class="ml-6 mt-1 space-y-1" v-if="submenuOpen?.monitor">
              <li>
                <router-link 
                  to="/monitor/task"
                  class="block px-3 py-2 rounded-md text-sm"
                  :class="isActive('/monitor/task') ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'"
                >
                  <i class="fa fa-tasks mr-2"></i>监控任务
                </router-link>
              </li>
              <li>
                <router-link 
                  to="/monitor/query"
                  class="block px-3 py-2 rounded-md text-sm"
                  :class="isActive('/monitor/query') ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'"
                >
                  <i class="fa fa-search mr-2"></i>监控查询
                </router-link>
              </li>
            </ul>
          </li>
          
          <!-- 交易管理 -->
          <li>
            <router-link 
              to="/transaction"
              class="flex items-center px-3 py-2 rounded-md text-sm"
              :class="isActive('/transaction') ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'"
            >
              <i class="fa fa-exchange-alt mr-3"></i>
              交易管理
            </router-link>
          </li>
          
          <!-- 系统管理 -->
          <li>
            <router-link 
              to="/system"
              class="flex items-center px-3 py-2 rounded-md text-sm"
              :class="isActive('/system') ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'"
            >
              <i class="fa fa-cog mr-3"></i>
              系统管理
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
    
    <!-- 右侧内容区域 - 添加了pr-4（16px右内边距） -->
    <div class="flex-1 overflow-auto">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

// 子菜单展开状态管理
const submenuOpen = ref({
  material: false,
  analysis: false,
  monitor: false
})

// 获取当前路由
const route = useRoute()

// 切换子菜单展开/收起
const toggleSubmenu = (key) => {
  // 关闭其他子菜单（实现互斥展开）
  Object.keys(submenuOpen.value).forEach(k => {
    if (k !== key) submenuOpen.value[k] = false
  })
  // 切换当前子菜单状态
  submenuOpen.value[key] = !submenuOpen.value[key]
}

// 判断路由是否匹配，用于高亮当前菜单
const isActive = (path) => {
  return route.path.startsWith(path)
}

// 监听路由变化，自动展开对应父菜单
watch(route, (newRoute) => {
  const path = newRoute.path
  // 根据当前路由自动展开对应的父菜单
  if (path.startsWith('/category') || path.startsWith('/material')) {
    submenuOpen.value.material = true
  } else if (path.startsWith('/analysis')) {
    submenuOpen.value.analysis = true
  } else if (path.startsWith('/monitor')) {
    submenuOpen.value.monitor = true
  } else {
    // 关闭所有子菜单
    Object.keys(submenuOpen.value).forEach(k => {
      submenuOpen.value[k] = false
    })
  }
}, { immediate: true })
</script>

<style scoped>
/* 可选：调整图标大小和间距 */
.fa {
  width: 1.25rem; /* 图标宽度统一 */
  text-align: center; /* 确保图标居中对齐 */
}

</style>
