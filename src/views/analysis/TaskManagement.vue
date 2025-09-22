<template>
  <div class="p-6 bg-gray-50">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-left">分析管理 > 任务管理</h2>
    </div>

     <!-- 查询筛选区域 -->
     <div class="bg-white p-4 rounded-md shadow-sm mb-6">
      <!-- 第一行：任务名称、上传日期、结束日期 -->
      <div class="grid grid-cols-3 gap-6 mb-4">
        <!-- 任务名称查询 -->
        <div class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1 text-left">任务名称</label>
          <input
            v-model="searchParams.taskName"
            type="text"
            placeholder="请输入任务名称"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm w-full"
          />
        </div>
        
        <!-- 上传日期范围 -->
        <div class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1 text-left">上传日期</label>
          <div class="flex items-center space-x-2 w-full">
            <input
              v-model="searchParams.uploadStartDate"
              type="date"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm flex-1"
            />
            <span class="text-gray-500 whitespace-nowrap">至</span>
            <input
              v-model="searchParams.uploadEndDate"
              type="date"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm flex-1"
            />
          </div>
        </div>
        
        <!-- 结束日期范围 -->
        <div class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1 text-left">结束日期</label>
          <div class="flex items-center space-x-2 w-full">
            <input
              v-model="searchParams.endStartDate"
              type="date"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm flex-1"
            />
            <span class="text-gray-500 whitespace-nowrap">至</span>
            <input
              v-model="searchParams.endEndDate"
              type="date"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm flex-1"
            />
          </div>
        </div>
      </div>
      
      <!-- 第二行：任务状态 + 按钮区域 -->
      <div class="grid grid-cols-3 gap-6 items-end">
        <!-- 任务状态筛选 -->
        <div class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1 text-left">任务状态</label>
          <select
            v-model="searchParams.status"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm w-full"
          >
            <option v-for="item in statusOptions" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
        </div>
        <!-- 查询按钮区域 -->
        <div class="flex justify-start space-x-3">
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            @click="fetchTaskData"
          >
            <i class="fa fa-search mr-1"></i>查询
          </button>
          <button
            class="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            @click="resetSearch"
          >
          <i class="fa fa-redo mr-1"></i>重置
          </button>
        </div>
        <!-- 空列占位（保持网格布局对齐） -->
        <div></div>
      </div>
    </div>

    <!-- 操作栏：新增任务 -->
    <div class="flex justify-between items-center mt-10 mb-2">
      <div class="ml-1 text-2xl">
        <h1 class="font-bold">任务列表</h1>
      </div>
      <div class="">
      <button
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
      >
        <i class="fa fa-plus mr-2"></i>新增任务
      </button>
    </div>
    </div>
    

    <!-- 任务列表表格 -->
    <div class="bg-white rounded-md shadow-sm overflow-hidden mb-6">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              任务编号
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              任务名称
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              上传日期
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              结束日期
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              优先级
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              状态
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              型号数量
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <!-- 无数据状态 -->
          <tr v-if="!taskList.length">
            <td colspan="8" class="px-6 py-8 text-center text-gray-500">
              <i class="fa fa-search-minus mr-2"></i>未查询到符合条件的任务数据
            </td>
          </tr>
          <!-- 任务数据列表 -->
          <tr v-for="(item, index) in taskList" :key="item.taskId" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.taskId }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.taskName }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.uploadDate }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.endDate }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="item.priority === 1 ? 'bg-red-100 text-red-800' : item.priority === 2 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'"
              >
                {{ item.priority }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="item.status === '未开始' ? 'bg-gray-100 text-gray-800' : item.status === '运行中' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'"
              >
                {{ item.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.modelCount }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-left">
              <button class="text-blue-600 hover:text-blue-900 mr-5">
                <i class="fa fa-pause"></i>暂停
              </button>
              <button class="text-blue-600 hover:text-blue-900 mr-5">
                <i class="fa fa-edit"></i>编辑
              </button>
              <button class="text-green-600 hover:text-green-900 mr-5">
                <i class="fa fa-download"></i>下载
              </button>
              <button class="text-red-600 hover:text-red-900" @click="handleDelete(item.taskId)">
                <i class="fa fa-trash"></i>删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页控件 -->
    <div class="flex justify-between items-center">
      <div class="text-sm text-gray-500">
        共 {{ totalCount }} 条任务
      </div>
      <div class="flex items-center space-x-1">
        <button
          class="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          <i class="fa fa-chevron-left text-xs"></i>
        </button>
        <button
          v-for="page in pageRange"
          :key="page"
          class="px-3 py-1 border border-gray-300 rounded-md text-sm"
          :class="currentPage === page ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
        <button
          class="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          <i class="fa fa-chevron-right text-xs"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .mb-1 {
    @apply text-left pl-1 py-2;
  }
}
</style>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 分页相关状态
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value));

// 搜索筛选参数
const searchParams = ref({
  taskName: '',
  uploadStartDate: '',
  uploadEndDate: '',
  endStartDate: '',
  endEndDate: '',
  status: '全部',
});

// 任务数据相关状态（初始为空数组）
const taskList = ref([]);
const statusOptions = ref(["全部", "未开始", "运行中", "已完成", "已暂停", "已失败"]);

// 生成分页页码范围
const pageRange = computed(() => {
  const range = [];
  const maxShow = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxShow / 2));
  let end = start + maxShow - 1;

  if (end > totalPages.value) {
    end = totalPages.value;
    start = Math.max(1, end - maxShow + 1);
  }

  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  return range;
});

// 模拟网络请求：获取任务数据（仅在点击搜索时触发）
const fetchTaskData = async () => {
  try {
    const response = await fetch('/TaskManagement.json');
    const data = await response.json();

    taskList.value = data.taskList;
    totalCount.value = data.totalCount;
  } catch (error) {
    console.error('任务数据获取失败:', error);
    taskList.value = [];
    totalCount.value = 0;
  }
};

// 重置搜索筛选条件
const resetSearch = () => {
  searchParams.value = {
    taskName: '',
    uploadStartDate: '',
    uploadEndDate: '',
    endStartDate: '',
    endEndDate: '',
    status: '全部',
  };
  currentPage.value = 1;
  // 重置后不自动加载数据，需用户再次点击查询
};

// 删除任务
const handleDelete = (taskId) => {
  if (confirm(`确定要删除任务【${taskId}】吗？`)) {
    taskList.value = taskList.value.filter(item => item.taskId !== taskId);
    totalCount.value -= 1;
  }
};

// 切换页码
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  // 分页切换时重新加载数据（保持与搜索逻辑一致）
  fetchTaskData();
};

// 页面挂载时不加载数据（关键修改）
onMounted(() => {
  // 注释掉自动加载数据的逻辑
  fetchTaskData();
});
</script>