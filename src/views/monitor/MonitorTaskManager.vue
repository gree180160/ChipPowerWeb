<!-- 无法和监控查询关联 -->
<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-900 text-left">监控管理 > 分析任务</h2>
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
              <option value="待处理">待处理</option>
              <option value="进行中">进行中</option>
              <option value="已完成">已完成</option>
              <option value="已取消">已取消</option>
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
        <i class="fa fa-plus mr-2"></i>新增监控任务
      </button>
    </div>

    <!-- 任务列表表格 -->
    <div class="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
      <div class="overflow-x-auto">
        <!-- table-fixed:固定列宽,确保 th 与 td 严格对齐;min-w 保证横向滚动 -->
        <table class="min-w-full divide-y divide-gray-200 table-fixed">
          <colgroup>
            <col class="w-20" />   <!-- 编号 -->
            <col class="w-44" />   <!-- 任务名称 -->
            <col class="w-64" />   <!-- 描述 -->
            <col class="w-24" />   <!-- 优先级 -->
            <col class="w-24" />   <!-- 状态 -->
            <col class="w-24" />   <!-- 型号数量 -->
            <col class="w-32" />   <!-- 上传日期 -->
            <col class="w-32" />   <!-- 结束日期 -->
            <col class="w-64" />   <!-- 操作 -->
          </colgroup>
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">编号</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">任务名称</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">描述</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">优先级</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">状态</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">型号数量</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">上传日期</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">结束日期</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- 加载状态 -->
            <tr v-if="loading">
              <td colspan="9" class="px-4 py-12 text-center text-gray-500">
                <div class="flex items-center justify-center">
                  <i class="fa fa-spinner fa-spin mr-2"></i>
                  <span>加载中...</span>
                </div>
              </td>
            </tr>

            <!-- 无数据状态 -->
            <tr v-else-if="taskList.length === 0">
              <td colspan="9" class="px-4 py-12 text-center text-gray-500">
                <div class="flex items-center justify-center">
                  <i class="fa fa-search-minus mr-2"></i>
                  <span>暂无数据</span>
                </div>
              </td>
            </tr>

            <!-- 任务数据行 -->
            <template v-else>
              <tr v-for="(task, index) in taskList" :key="task.taskId" class="hover:bg-gray-50">
                <td class="px-4 py-4 text-sm text-gray-500 text-left truncate" :title="task.taskId">{{ task.taskId }}</td>
                <td class="px-4 py-4 text-sm text-left">
                  <a href="javascript:void(0)" class="text-blue-600 hover:text-blue-900 hover:underline font-medium block truncate" :title="task.taskName" @click="handleViewDetail(task.taskId)">
                    {{ task.taskName }}
                  </a>
                </td>
                <td class="px-4 py-4 text-sm text-gray-600 text-left truncate" :title="task.taskDesc">{{ task.taskDesc || '-' }}</td>
                <td class="px-4 py-4 text-sm text-left">
                  <span class="px-2 inline-block text-xs leading-5 font-semibold rounded-full" :class="levelClass(task.Tlevel)">
                    {{ levelLabel(task.Tlevel) }}
                  </span>
                </td>
                <td class="px-4 py-4 text-sm text-left">
                  <span class="px-2 inline-block text-xs leading-5 font-semibold rounded-full" :class="stateClass(task.Tstate)">
                    {{ stateLabel(task.Tstate) }}
                  </span>
                </td>
                <td class="px-4 py-4 text-sm text-gray-600 text-left truncate">{{ task.modelCount }}</td>
                <td class="px-4 py-4 text-sm text-gray-600 text-left truncate">{{ task.uploadDate }}</td>
                <td class="px-4 py-4 text-sm text-gray-600 text-left truncate">{{ task.endDate }}</td>
                <td class="px-4 py-4 text-left">
                  <!-- 编辑按钮 -->
                  <button
                    @click="handleEdit(task)"
                    class="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 mr-2 transition-colors duration-200"
                  >
                    <i class="fa fa-edit mr-1.5"></i>
                    <span>编辑</span>
                  </button>
                  <!-- 下载按钮 -->
                  <button
                    @click="handleDownload(task)"
                    class="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 mr-2 transition-colors duration-200"
                  >
                    <i class="fa fa-download mr-1.5"></i>
                    <span>下载</span>
                  </button>
                  <!-- 删除按钮 -->
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
    <!-- 新增监控任务弹框 -->
    <TaskCreateModal
      :visible="showCreateModal"
      :default-kind="1"
      @close="showCreateModal = false"
      @success="onTaskCreated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import TaskCreateModal from '../analysis/TaskCreateModal.vue';

const API_BASE_URL = 'http://localhost:8001/api/data';
const router = useRouter();

// 状态映射(数据库 Tstate -> 展示文本/样式)
const stateMap = {
  0: { label: '待处理', class: 'bg-gray-100 text-gray-800' },
  1: { label: '进行中', class: 'bg-blue-100 text-blue-800' },
  2: { label: '已完成', class: 'bg-green-100 text-green-800' },
  3: { label: '已取消', class: 'bg-red-100 text-red-800' },
};

// 优先级映射(Tlevel -> 文本/样式)
const levelMap = {
  1: { label: '普通', class: 'bg-gray-100 text-gray-800' },
  2: { label: '重要', class: 'bg-yellow-100 text-yellow-800' },
  3: { label: '紧急', class: 'bg-red-100 text-red-800' },
};

// 新增任务弹框
const showCreateModal = ref(false);

// 新建任务成功回调:关闭弹框并刷新列表
const onTaskCreated = () => {
  showCreateModal.value = false;
  fetchData();
};

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

// 日期格式化(YYYY-MM-DD HH:MM:SS → YYYY-MM-DD)
const formatDate = (s) => (s ? String(s).split(' ')[0] : '-');

// 状态码 → 文本
const stateLabel = (code) => stateMap[code]?.label || '未知';

// 状态码 → 样式
const stateClass = (code) => stateMap[code]?.class || 'bg-gray-100 text-gray-800';

// 优先级 → 文本
const levelLabel = (code) => levelMap[code]?.label || '未知';

// 优先级 → 样式
const levelClass = (code) => levelMap[code]?.class || 'bg-gray-100 text-gray-800';

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

// 获取真实监控任务数据:调用 service task/read (tkind=1 监控任务) + ppn/count_by_source
const fetchData = async () => {
  loading.value = true;

  try {
    // 1. 并发获取任务列表 + PPN 数量统计
    const [taskResp, countResp] = await Promise.all([
      axios.get(`${API_BASE_URL}/task/read`, { params: { filter_contend: 'tkind = 1' }, timeout: 30000 }),
      axios.get(`${API_BASE_URL}/ppn/count_by_source`, { timeout: 30000 }),
    ]);

    if (taskResp.data?.code !== 200) {
      throw new Error(taskResp.data?.message || 'task/read 失败');
    }

    const rows = taskResp.data.data || [];
    // service 返回二维数组,列顺序: TID, Tname, Tdes, Tstate, Tlevel, tkind, TstartDate, TendDate
    const countMap = countResp.data?.code === 200 ? (countResp.data.data || {}) : {};

    const allTasks = rows.map(r => ({
      taskId: r[0],
      taskName: r[1] || '',
      taskDesc: r[2] || '',
      Tstate: r[3],
      Tlevel: r[4],
      tkind: r[5],
      uploadDate: formatDate(r[6]),
      monitorStartDate: formatDate(r[6]),  // 数据库无单独"开始监控日期",暂与上传日期相同
      endDate: formatDate(r[7]),
      modelCount: countMap[r[1]] || 0,  // source = Tname
    }));

    // 2. 前端筛选(按搜索条件)
    let filtered = allTasks;
    if (searchForm.value.taskName) {
      filtered = filtered.filter(t => t.taskName.toLowerCase().includes(searchForm.value.taskName.toLowerCase()));
    }
    if (searchForm.value.uploadDate) {
      filtered = filtered.filter(t => t.uploadDate === searchForm.value.uploadDate);
    }
    if (searchForm.value.monitorStartDate) {
      filtered = filtered.filter(t => t.monitorStartDate === searchForm.value.monitorStartDate);
    }
    if (searchForm.value.taskStatus && searchForm.value.taskStatus !== '全部') {
      filtered = filtered.filter(t => stateLabel(t.Tstate) === searchForm.value.taskStatus);
    }

    // 3. 分页
    total.value = filtered.length;
    const startIndex = (currentPage.value - 1) * pageSize.value;
    const endIndex = startIndex + pageSize.value;
    taskList.value = filtered.slice(startIndex, endIndex);

    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value;
    }
  } catch (error) {
    console.error('获取数据失败:', error);
    alert(`数据加载失败: ${error.message}`);
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
  showCreateModal.value = true;
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
// 查看任务详情(任务名蓝色超链接点击)
const handleViewDetail = (taskId) => {
  router.push(`/monitor/task/${taskId}`);
};

// 编辑任务:跳转到任务详情页
const handleEdit = (task) => {
  router.push(`/monitor/task/${task.taskId}`);
};

// 下载任务关联的 PPN 列表(CSV)
const handleDownload = async (task) => {
  try {
    const resp = await axios.get(`${API_BASE_URL}/ppn/read`, {
      params: { filter_contend: `source = "${task.taskName}"` },
      timeout: 30000,
    });
    if (resp.data?.code !== 200) {
      throw new Error(resp.data?.message || '获取 PPN 失败');
    }
    const rows = resp.data.data || [];
    if (!rows.length) {
      alert(`任务【${task.taskName}】没有关联的 PPN 数据`);
      return;
    }
    const header = ['ppn', 'manu_id', 'manu_name', 'source', 'note', 'upload_date'];
    const csvLines = [header.join(',')];
    rows.forEach(r => {
      const line = r.map(v => {
        const s = (v === null || v === undefined) ? '' : String(v);
        return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
      }).join(',');
      csvLines.push(line);
    });
    const csv = '\ufeff' + csvLines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${task.taskName}_ppn.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error('下载 PPN 失败:', e);
    alert(`下载失败: ${e.message}`);
  }
};

// 删除任务:调 service task/delete
const handleDelete = async (task) => {
  if (!confirm(`确定要删除监控任务【${task.taskName}】(ID: ${task.taskId})吗?\n注意:仅删除任务记录,关联的 PPN 数据不会被删除。`)) {
    return;
  }
  try {
    const resp = await axios.post(`${API_BASE_URL}/task/delete`, { TID: task.taskId }, { timeout: 10000 });
    if (resp.data?.code === 200) {
      alert(`任务【${task.taskName}】已删除`);
      fetchData();
    } else {
      throw new Error(resp.data?.message || '删除失败');
    }
  } catch (e) {
    console.error('删除任务失败:', e);
    alert(`删除任务失败: ${e.message}`);
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