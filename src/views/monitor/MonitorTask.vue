<!-- 无法和监控查询关联 -->
<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-900 text-left">监控管理 > 任务管理</h2>
    </div>

    <!-- 筛选条件区域 -->
    <div class="bg-white p-5 rounded-lg shadow-sm mb-6">
      <form class="space-y-4">
        <!-- 第一行筛选条件 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- 任务名称 -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-2 text-left">任务名称</label>
            <input
              v-model="searchForm.taskName"
              type="text"
              placeholder="请输入任务名称"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- 任务上传日期 -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-2 text-left">任务上传日期</label>
            <input
              v-model="searchForm.uploadDate"
              type="date"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- 开始监控日期 -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-2 text-left">开始监控日期</label>
            <input
              v-model="searchForm.monitorStartDate"
              type="date"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- 任务状态 -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-2 text-left">任务状态</label>
            <select
              v-model="searchForm.taskStatus"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">全部</option>
              <option value="进行中">进行中</option>
              <option value="未开始">未开始</option>
              <option value="已完成">已完成</option>
            </select>
          </div>
        </div>

        <!-- 按钮区域 -->
        <div class="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            @click="resetForm"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            重置
          </button>
          <button
            type="button"
            @click="fetchData"
            class="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            查询
          </button>
        </div>
      </form>
    </div>

    <!-- 新增按钮 -->
    <div class="mb-6 flex justify-end">
      <button
        @click="handleAddMonitor"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <i class="fa fa-plus mr-2"></i>新增监控
      </button>
    </div>

    <!-- 任务列表表格 -->
    <div class="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">任务编号</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">任务名称</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">上传日期</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">开始监控日期</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">监控状态</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">型号数量</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- 加载状态 -->
            <tr v-if="loading">
              <td colspan="7" class="px-6 py-12 text-center text-gray-500">
                <div class="flex items-center justify-center">
                  <i class="fa fa-spinner fa-spin mr-2"></i>
                  <span>加载中...</span>
                </div>
              </td>
            </tr>

            <!-- 无数据状态 -->
            <tr v-else-if="taskList.length === 0">
              <td colspan="7" class="px-6 py-12 text-center text-gray-500">
                <div class="flex items-center justify-center">
                  <i class="fa fa-search-minus mr-2"></i>
                  <span>暂无数据</span>
                </div>
              </td>
            </tr>

            <!-- 任务数据行 -->
            <template v-else>
              <tr v-for="(task, index) in taskList" :key="task.taskId" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ task.taskId }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ task.taskName }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ task.uploadDate }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ task.monitorStartDate }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="statusStyles[task.monitorStatus]"
                  >
                    {{ task.monitorStatus }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ task.modelCount }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <!-- 暂停按钮 - 移除边框，调整间距 -->
                  <button
                    v-if="task.monitorStatus === '进行中'"
                    @click="handlePause(task)"
                    class="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 mr-2 transition-colors duration-200"
                  >
                    <i class="fa fa-pause mr-1.5"></i>
                    <span>暂停</span>
                  </button>
                  
                  <!-- 开始按钮 - 移除边框 -->
                  <button
                    v-if="task.monitorStatus === '未开始'"
                    @click="handleStart(task)"
                    class="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 mr-2 transition-colors duration-200"
                  >
                    <i class="fa fa-play mr-1.5"></i>
                    <span>开始</span>
                  </button>
                  
                  <!-- 编辑按钮 - 移除边框 -->
                  <button
                    @click="handleEdit(task)"
                    class="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 mr-2 transition-colors duration-200"
                  >
                    <i class="fa fa-edit mr-1.5"></i>
                    <span>编辑</span>
                  </button>
                  
                  <!-- 下载按钮 - 移除边框 -->
                  <button
                    @click="handleDownload(task)"
                    class="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 mr-2 transition-colors duration-200"
                  >
                    <i class="fa fa-download mr-1.5"></i>
                    <span>下载</span>
                  </button>
                  
                  <!-- 删除按钮 - 移除边框 -->
                  <button
                    @click="handleDelete(task)"
                    class="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors duration-200"
                  >
                    <i class="fa fa-trash mr-1.5"></i>
                    <span>删除</span>
                  </button>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 增强版分页控件 -->
    <div v-if="total > 0" class="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
      <!-- 左侧：每页显示条数设置 -->
      <div class="mb-4 sm:mb-0 flex items-center text-sm text-gray-700">
        <span class="mr-2">每页显示：</span>
        <select
          v-model="pageSize"
          @change="handlePageSizeChange"
          class="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          :disabled="loading"
        >
          <option value="10">10条</option>
          <option value="20">20条</option>
          <option value="50">50条</option>
          <option value="100">100条</option>
        </select>
        <span class="ml-4">
          共 <span class="font-medium">{{ total }}</span> 条记录
        </span>
      </div>

      <!-- 右侧：分页控制和页码跳转 -->
      <div class="flex items-center space-x-4">
        <!-- 分页导航 -->
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button
            @click="changePage(1)"
            :disabled="currentPage === 1 || loading"
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <i class="fa fa-angle-double-left"></i>
          </button>
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1 || loading"
            class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <i class="fa fa-angle-left"></i>
          </button>
          
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="changePage(page)"
            :disabled="loading"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium"
            :class="{
              'z-10 bg-blue-50 border-blue-500 text-blue-600': currentPage === page,
              'text-gray-700 hover:bg-gray-50': currentPage !== page
            }"
          >
            {{ page }}
          </button>
          
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages || loading"
            class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <i class="fa fa-angle-right"></i>
          </button>
          <button
            @click="changePage(totalPages)"
            :disabled="currentPage === totalPages || loading"
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <i class="fa fa-angle-double-right"></i>
          </button>
        </nav>

        <!-- 页码跳转 -->
        <div class="flex items-center text-sm">
          <span class="mr-2">前往</span>
          <input
            v-model="jumpPage"
            type="number"
            min="1"
            :max="totalPages"
            class="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @keyup.enter="handleJumpPage"
            :disabled="loading"
          >
          <span class="mx-2">页</span>
          <button
            @click="handleJumpPage"
            class="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
            :disabled="!jumpPage || jumpPage < 1 || jumpPage > totalPages || loading"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

// 搜索表单数据
const searchForm = ref({
  taskName: '',
  uploadDate: '',
  monitorStartDate: '',
  taskStatus: ''
});

// 任务列表数据
const taskList = ref([]);
const total = ref(0);
const loading = ref(false);

// 分页参数
const currentPage = ref(1);
const pageSize = ref(10);
const jumpPage = ref('');

// 状态样式映射
const statusStyles = {
  '进行中': 'bg-green-100 text-green-800',
  '未开始': 'bg-yellow-100 text-yellow-800',
  '已完成': 'bg-blue-100 text-blue-800'
};

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(total.value / pageSize.value) || 1;
});

// 监听当前页变化，更新跳转输入框
watch(currentPage, (newVal) => {
  jumpPage.value = newVal.toString();
});

// 计算可见页码
const visiblePages = computed(() => {
  const pages = [];
  const maxDisplayed = 5;
  const total = totalPages.value;
  
  // 总页数小于等于最大显示数，直接显示所有页码
  if (total <= maxDisplayed) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    return pages;
  }
  
  // 处理边界情况
  let startPage = Math.max(1, currentPage.value - Math.floor(maxDisplayed / 2));
  let endPage = startPage + maxDisplayed - 1;
  
  // 调整结束页
  if (endPage > total) {
    endPage = total;
    startPage = Math.max(1, endPage - maxDisplayed + 1);
  }
  
  // 添加页码
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return pages;
});

// 模拟网络请求获取数据
const fetchData = async () => {
  loading.value = true;
  
  try {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // 加载本地JSON数据
    const response = await fetch('/MonitorTaskData.json');
    
    if (!response.ok) {
      throw new Error(`数据加载失败: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 模拟分页处理
    const startIndex = (currentPage.value - 1) * pageSize.value;
    const endIndex = startIndex + pageSize.value;
    taskList.value = data.taskList.slice(startIndex, endIndex);
    total.value = data.total;
    
    // 确保跳转页码在有效范围内
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value;
    }
  } catch (error) {
    console.error('获取数据失败:', error);
    alert('数据加载失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  searchForm.value = {
    taskName: '',
    uploadDate: '',
    monitorStartDate: '',
    taskStatus: ''
  };
  currentPage.value = 1;
  fetchData();
};

// 切换页码
const changePage = (page) => {
  if (page < 1 || page > totalPages.value || loading.value) {
    return;
  }
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  fetchData();
};

// 处理每页显示条数变化
const handlePageSizeChange = () => {
  currentPage.value = 1;
  fetchData();
};

// 处理页码跳转
const handleJumpPage = () => {
  const page = parseInt(jumpPage.value, 10);
  if (Number.isInteger(page) && page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchData();
  } else {
    alert(`请输入1到${totalPages.value}之间的页码`);
    jumpPage.value = currentPage.value.toString();
  }
};

// 新增监控任务
const handleAddMonitor = () => {
  alert('新增监控任务功能待实现');
};

// 暂停任务
const handlePause = (task) => {
  if (confirm(`确定要暂停任务 "${task.taskName}" 吗？`)) {
    alert(`已暂停任务: ${task.taskName}`);
  }
};

// 开始任务
const handleStart = (task) => {
  if (confirm(`确定要开始任务 "${task.taskName}" 吗？`)) {
    alert(`已开始任务: ${task.taskName}`);
  }
};

// 编辑任务
const handleEdit = (task) => {
  alert(`编辑任务: ${task.taskName}`);
};

// 下载任务
const handleDownload = (task) => {
  alert(`下载任务数据: ${task.taskName}`);
};

// 删除任务
const handleDelete = (task) => {
  if (confirm(`确定要删除任务 "${task.taskName}" 吗？此操作不可撤销。`)) {
    alert(`已删除任务: ${task.taskName}`);
    fetchData();
  }
};

// 页面加载时获取数据
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
/* 表格滚动条样式优化 */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f7fafc;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 3px;
}

/* 按钮禁用样式 */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button:disabled:hover {
  background-color: transparent;
}

/* 输入框样式优化 */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* 表格行 hover 过渡 */
tr {
  transition: background-color 0.2s ease;
}
</style>