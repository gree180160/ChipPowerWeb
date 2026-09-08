<template>
  <div class="p-6 bg-gray-50">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-left">分析管理 > 分析任务管理</h2>
    </div>

     <!-- 查询筛选区域 -->
     <div class="bg-white p-4 rounded-md shadow-sm mb-6">
      <!-- 第一行：分析任务名称、上传日期、结束日期 -->
      <div class="grid grid-cols-3 gap-6 mb-4">
        <!-- 分析任务名称查询 -->
        <div class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1 text-left">分析任务名称</label>
          <input
            v-model="searchParams.taskName"
            type="text"
            placeholder="请输入分析任务名称"
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
      
      <!-- 第二行：分析任务状态 + 按钮区域 -->
      <div class="grid grid-cols-3 gap-6 items-end">
        <!-- 分析任务状态筛选 -->
        <div class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1 text-left">分析任务状态</label>
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

    <!-- 操作栏：新增分析任务 -->
    <div class="flex justify-between items-center mt-10 mb-2">
      <div class="ml-1 text-2xl">
        <h1 class="font-bold">分析任务列表</h1>
      </div>
      <div class="">
      <button
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        @click="showCreateModal = true"
      >
        <i class="fa fa-plus mr-2"></i>新增分析任务
      </button>
    </div>
    </div>
    

    <!-- 分析任务列表表格 -->
    <div class="bg-white rounded-md shadow-sm overflow-hidden mb-6">
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
            <col class="w-52" />   <!-- 操作 -->
          </colgroup>
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">编号</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">任务名称</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">描述</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">优先级</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">状态</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">型号数量</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">上传日期</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">结束日期</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- 加载状态 -->
            <tr v-if="loading">
              <td colspan="9" class="px-4 py-8 text-center text-gray-500">
                <i class="fa fa-spinner fa-spin mr-2"></i>加载中...
              </td>
            </tr>
            <!-- 无数据状态 -->
            <tr v-else-if="!taskList.length">
              <td colspan="9" class="px-4 py-8 text-center text-gray-500">
                <i class="fa fa-search-minus mr-2"></i>未查询到符合条件的分析任务数据
              </td>
            </tr>
            <!-- 分析任务数据列表 -->
            <tr v-for="item in taskList" :key="item.taskId" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-4 text-sm text-gray-500 text-left truncate" :title="item.taskId">{{ item.taskId }}</td>
              <td class="px-4 py-4 text-sm text-left">
                <a href="javascript:void(0)" class="text-blue-600 hover:text-blue-900 hover:underline font-medium block truncate" :title="item.taskName" @click="handleViewDetail(item.taskId)">
                  {{ item.taskName }}
                </a>
              </td>
              <td class="px-4 py-4 text-sm text-gray-600 text-left truncate" :title="item.taskDesc">{{ item.taskDesc || '-' }}</td>
              <td class="px-4 py-4 text-sm text-left">
                <span class="px-2 inline-block text-xs leading-5 font-semibold rounded-full" :class="levelClass(item.Tlevel)">
                  {{ levelLabel(item.Tlevel) }}
                </span>
              </td>
              <td class="px-4 py-4 text-sm text-left">
                <span class="px-2 inline-block text-xs leading-5 font-semibold rounded-full" :class="stateClass(item.Tstate)">
                  {{ stateLabel(item.Tstate) }}
                </span>
              </td>
              <td class="px-4 py-4 text-sm text-gray-600 text-left truncate">{{ item.modelCount }}</td>
              <td class="px-4 py-4 text-sm text-gray-600 text-left truncate">{{ item.uploadDate }}</td>
              <td class="px-4 py-4 text-sm text-gray-600 text-left truncate">{{ item.endDate }}</td>
              <td class="px-4 py-4 text-sm font-medium text-left">
                <button class="text-blue-600 hover:text-blue-900 mr-3" @click="handleEdit(item)">
                  <i class="fa fa-edit"></i>编辑
                </button>
                <button class="text-green-600 hover:text-green-900 mr-3" @click="handleDownload(item)">
                  <i class="fa fa-download"></i>下载
                </button>
                <button class="text-red-600 hover:text-red-900" @click="handleDelete(item)">
                  <i class="fa fa-trash"></i>删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 分页控件 -->
    <div class="flex justify-between items-center">
      <div class="text-sm text-gray-500">
        共 {{ totalCount }} 条分析任务
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

    <!-- 新增分析分析任务弹框 -->
    <TaskCreateModal
      :visible="showCreateModal"
      @close="showCreateModal = false"
      @success="onTaskCreated"
    />
  </div>
</template>

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
/* table-fixed 下,长文本单元格统一截断 */
td, th {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import TaskCreateModal from './TaskCreateModal.vue';

import { API_BASE_URL } from '@/config'
const router = useRouter();

// 状态映射(数据库 Tstate -> 展示文本/样式)
const stateMap = {
  0: { label: '待处理', class: 'bg-gray-100 text-gray-800' },
  1: { label: '进行中', class: 'bg-blue-100 text-blue-800' },
  2: { label: '已完成', class: 'bg-green-100 text-green-800' },
  3: { label: '已取消', class: 'bg-red-100 text-red-800' },
  4: { label: '简化版完成', class: 'bg-purple-100 text-purple-800' },
};

// 优先级映射(Tlevel -> 文本/样式)
const levelMap = {
  1: { label: '普通', class: 'bg-gray-100 text-gray-800' },
  2: { label: '重要', class: 'bg-yellow-100 text-yellow-800' },
  3: { label: '紧急', class: 'bg-red-100 text-red-800' },
};

// 新增分析分析任务弹框
const showCreateModal = ref(false);

// 新建分析任务成功回调:关闭弹框并刷新列表
const onTaskCreated = () => {
  showCreateModal.value = false;
  fetchTaskData();
};

// 跳转到分析任务详情页
const handleViewDetail = (taskId) => {
  router.push(`/analysis/task/${taskId}`);
};

// 分页相关状态
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value) || 1);

// 搜索筛选参数
const searchParams = ref({
  taskName: '',
  uploadStartDate: '',
  uploadEndDate: '',
  endStartDate: '',
  endEndDate: '',
  status: '全部',
});

const statusOptions = ref(['全部', '待处理', '进行中', '已完成', '已取消', '简化版完成']);

// 分析任务数据相关状态
const taskList = ref([]);
const loading = ref(false);

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

// 获取真实任务数据:调用 service task/read (tkind=0 分析任务) + ppn/count_by_source
const fetchTaskData = async () => {
  loading.value = true;
  try {
    // 1. 并发获取任务列表 + PPN 数量统计
    const [taskResp, countResp] = await Promise.all([
      axios.get(`${API_BASE_URL}/task/read`, { params: { filter_contend: 'tkind = 0' }, timeout: 30000 }),
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
      endDate: formatDate(r[7]),
      modelCount: countMap[r[1]] || 0,  // source = Tname
    }));

    // 2. 前端筛选(按搜索条件)
    let filtered = allTasks;
    if (searchParams.value.taskName) {
      filtered = filtered.filter(t => t.taskName.toLowerCase().includes(searchParams.value.taskName.toLowerCase()));
    }
    if (searchParams.value.uploadStartDate) {
      filtered = filtered.filter(t => t.uploadDate >= searchParams.value.uploadStartDate);
    }
    if (searchParams.value.uploadEndDate) {
      filtered = filtered.filter(t => t.uploadDate <= searchParams.value.uploadEndDate);
    }
    if (searchParams.value.endStartDate) {
      filtered = filtered.filter(t => t.endDate >= searchParams.value.endStartDate);
    }
    if (searchParams.value.endEndDate) {
      filtered = filtered.filter(t => t.endDate <= searchParams.value.endEndDate);
    }
    if (searchParams.value.status !== '全部') {
      filtered = filtered.filter(t => stateLabel(t.Tstate) === searchParams.value.status);
    }

    // 按上传日期倒序(YYYY-MM-DD 降序 = 时间倒序,空值 '-' 排在末尾)
    filtered.sort((a, b) => b.uploadDate.localeCompare(a.uploadDate));

    // 3. 分页
    totalCount.value = filtered.length;
    const startIdx = (currentPage.value - 1) * pageSize.value;
    taskList.value = filtered.slice(startIdx, startIdx + pageSize.value);
  } catch (error) {
    console.error('分析任务数据获取失败:', error);
    alert(`分析任务数据获取失败: ${error.message}`);
    taskList.value = [];
    totalCount.value = 0;
  } finally {
    loading.value = false;
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
  fetchTaskData();
};

// 编辑任务:跳转到任务详情页(在详情页支持修改名称/描述/增删 ppn)
const handleEdit = (item) => {
  router.push(`/analysis/task/${item.taskId}`);
};

// 下载任务关联的 PPN 列表(CSV)
const handleDownload = async (item) => {
  try {
    const resp = await axios.get(`${API_BASE_URL}/ppn/read`, {
      params: { filter_contend: `source = "${item.taskName}"` },
      timeout: 30000,
    });
    if (resp.data?.code !== 200) {
      throw new Error(resp.data?.message || '获取 PPN 失败');
    }
    const rows = resp.data.data || [];
    if (!rows.length) {
      alert(`任务【${item.taskName}】没有关联的 PPN 数据`);
      return;
    }
    // service 返回二维数组,列顺序: ppn, manu_id, manu_name, source, note, upload_date
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
    a.download = `${item.taskName}_ppn.csv`;
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
const handleDelete = async (item) => {
  if (!confirm(`确定要删除分析任务【${item.taskName}】(ID: ${item.taskId})吗?\n注意:仅删除任务记录,关联的 PPN 数据不会被删除。`)) {
    return;
  }
  try {
    const resp = await axios.post(`${API_BASE_URL}/task/delete`, { TID: item.taskId }, { timeout: 10000 });
    if (resp.data?.code === 200) {
      alert(`任务【${item.taskName}】已删除`);
      fetchTaskData();
    } else {
      throw new Error(resp.data?.message || '删除失败');
    }
  } catch (e) {
    console.error('删除任务失败:', e);
    alert(`删除任务失败: ${e.message}`);
  }
};

// 切换页码
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  fetchTaskData();
};

// 页面挂载时加载数据
onMounted(() => {
  fetchTaskData();
});
</script>