<template>
  <div class="p-6 bg-gray-50">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-left">物料管理 > 物料中心</h2>
    </div>

    <!-- 操作栏：新增 + 批量操作 -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex space-x-3">
        <button class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
          <i class="fa fa-plus mr-2"></i>新增物料
        </button>
        <button class="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center">
          <i class="fa fa-download mr-2"></i>批量导入
        </button>
        <button class="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center">
          <i class="fa fa-upload mr-2"></i>批量导出
        </button>
      </div>
      <div class="flex items-center space-x-2">
        <label class="text-gray-700">显示：</label>
        <select 
          v-model="pageSize" 
          class="px-3 py-1 border border-gray-300 rounded-md text-sm"
          @change="fetchMaterialData"
        >
          <option value="10">10条/页</option>
          <option value="20">20条/页</option>
          <option value="50">50条/页</option>
          <option value="100">100条/页</option>
        </select>
      </div>
    </div>

    <!-- 查询筛选区域 -->
    <div class="bg-white p-4 rounded-md shadow-sm mb-6">
      <!-- 第一行：型号、品牌、物料类别 -->
      <div class="grid grid-cols-3 gap-6 mb-4">
        <!-- 型号查询 -->
        <div class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1 text-left">型号</label>
          <input 
            v-model="searchParams.model" 
            type="text" 
            placeholder="请输入型号"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
        </div>
        
        <!-- 品牌筛选 -->
        <div class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1 text-left">品牌</label>
          <select 
            v-model="searchParams.brand" 
            class="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">全部品牌</option>
            <option v-for="item in brandOptions" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
        </div>
        
        <!-- 物料类别筛选 -->
        <div class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1 text-left">物料类别</label>
          <select 
            v-model="searchParams.category" 
            class="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">全部分类</option>
            <option v-for="item in categoryOptions" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
        </div>
      </div>
      
      <!-- 第二行：区域、入库日期、分析进度 -->
      <div class="grid grid-cols-3 gap-6 mb-4">
        <!-- 区域筛选 -->
        <div class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1 text-left">区域</label>
          <select 
            v-model="searchParams.region" 
            class="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">全部区域</option>
            <option value="中国">中国</option>
            <option value="美国">美国</option>
            <option value="日本">日本</option>
            <option value="俄罗斯">俄罗斯</option>
            <option value="欧洲">欧洲</option>
          </select>
        </div>
        
        <!-- 入库日期筛选 -->
        <div class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1 text-left">入库日期</label>
          <div class="flex items-center w-full gap-2 px-0">
            <input 
              v-model="searchParams.storageStartTime" 
              type="date" 
              class="px-3 py-2 border border-gray-300 rounded-md text-sm flex-1"
              placeholder="开始日期"
            >
            <span class="text-gray-500 whitespace-nowrap">至</span>
            <input 
              v-model="searchParams.storageEndTime" 
              type="date" 
              class="px-3 py-2 border border-gray-300 rounded-md text-sm flex-1"
              placeholder="结束日期"
            >
          </div>
        </div>
        
        <!-- 分析进度筛选 -->
        <div class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1 text-left">分析进度</label>
          <select 
            v-model="searchParams.analysisProgress" 
            class="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">全部</option>
            <option value="已完成">已完成</option>
            <option value="未完成">未完成</option>
          </select>
        </div>
      </div>
      
      <!-- 查询按钮区域 -->
      <div class="flex justify-end space-x-3 mt-2">
        <button 
          class="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          @click="resetSearch"
        >
          重置
        </button>
        <button 
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          @click="fetchMaterialData"
        >
          <i class="fa fa-search mr-1"></i>查询
        </button>
      </div>
    </div>

    <!-- 物料列表表格 -->
    <div class="bg-white rounded-md shadow-sm overflow-hidden mb-6">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
              <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">型号</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">品牌</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">产品大类</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">产品小类</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">区域</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">入库日期</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分析进度</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">规格书</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <!-- 无数据状态 -->
          <tr v-if="!materialList.length">
            <td colspan="11" class="px-6 py-8 text-center text-gray-500">
              <i class="fa fa-search-minus mr-2"></i>未查询到符合条件的物料数据
            </td>
          </tr>
          <!-- 物料数据列表 -->
          <tr v-for="(item, index) in materialList" :key="item.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.PPN }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.brand }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.category.split(">")[0]?.trim() || ""}}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.category.split(">")[1]?.trim() || ""}}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.area }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.createTime }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="item.analyseProgress == '1' ? 'bg-green-100 text-green-900' : 'bg-amber-100 text-amber-900'"
              >
                {{ item.analyseProgress == 1 ? "已完成" : "进行中" }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="item.status == 'Active' ? 'bg-green-50 text-green-900' : 'bg-red-100 text-red-900'"
              >
                {{ item.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              <a class="fa fa-file text-blue-600 hover:text-blue-900" :href="item.rulebook" target="_blank"></a>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button class="text-blue-600 hover:text-blue-900 mr-3">
                <i class="fa fa-edit mr-1"></i>编辑
              </button>
              <!-- 详情按钮：使用命名路由跳转 -->
              <button 
                class="text-green-600 hover:text-green-900 mr-3"
                @click="goToDetail(item.PPN)"
              >
                <i class="fa fa-eye mr-1"></i>详情
              </button>
              <button class="text-red-600 hover:text-red-900" @click="handleDelete(item.id)">
                <i class="fa fa-trash mr-1"></i>删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页控件 -->
    <div class="flex justify-between items-center">
      <div class="text-sm text-gray-500">
        显示 {{ (currentPage - 1) * pageSize + 1 }} 至 {{ Math.min(currentPage * pageSize, totalCount) }} 条，共 {{ totalCount }} 条
      </div>
      <div class="flex items-center space-x-1">
        <button 
          class="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          <i class="fa fa-chevron-left text-xs"></i> 上一页
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
          下一页 <i class="fa fa-chevron-right text-xs"></i>
        </button>
        <div class="flex items-center space-x-1 ml-2">
          <span class="text-sm text-gray-700">跳至</span>
          <input 
            v-model="targetPage" 
            type="number" 
            min="1" 
            :max="totalPages || 1"
            class="w-12 px-2 py-1 border border-gray-300 rounded-md text-sm text-center"
          >
          <span class="text-sm text-gray-700">页</span>
          <button 
            class="px-2 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
            @click="changePage(Number(targetPage))"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router' // 引入路由

// 初始化路由实例
const router = useRouter()

// 分页相关状态
const currentPage = ref(1)
const pageSize = ref(10)
const targetPage = ref(1)
const totalCount = ref(0)
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value))

// 搜索筛选参数
const searchParams = ref({
  model: '',               // 型号
  brand: '',               // 品牌
  category: '',            // 物料类别
  region: '',              // 区域
  storageStartTime: '',    // 入库开始日期
  storageEndTime: '',      // 入库结束日期
  analysisProgress: ''     // 分析进度
})

// 物料数据相关状态
const materialList = ref([])
const categoryOptions = ref([])
const brandOptions = ref([])
const statusOptions = ref([])

// 生成分页页码范围（最多显示5个页码）
const pageRange = computed(() => {
  const range = []
  const maxShow = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxShow / 2))
  let end = start + maxShow - 1

  // 调整结束页码不超过总页数
  if (end > totalPages.value) {
    end = totalPages.value
    start = Math.max(1, end - maxShow + 1)
  }

  for (let i = start; i <= end; i++) {
    range.push(i)
  }
  return range
})

// 模拟网络请求：获取物料数据
const fetchMaterialData = async () => {
  try {
    // TODO: 待接入 service 真实接口(原 /MaterialCenter.json 假数据已删除)
    console.warn('MaterialCenter: 假数据已删除,待接入 service 真实接口')
    materialList.value = []
    totalCount.value = 0
    targetPage.value = currentPage.value
  } catch (error) {
    console.error('物料数据获取失败:', error)
    materialList.value = []
    totalCount.value = 0
  }
}

// 重置搜索条件方法
const resetSearch = () => {
  searchParams.value = {
    model: '',
    brand: '',
    category: '',
    region: '',
    storageStartTime: '',
    storageEndTime: '',
    analysisProgress: ''
  }
  currentPage.value = 1
  fetchMaterialData()
}

// 切换页码
const changePage = (page) => {
  // 边界值处理
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  targetPage.value = page
  fetchMaterialData()
}

// 删除物料（模拟）
const handleDelete = (id) => {
  if (confirm(`确定要删除物料【${id}】吗？删除后不可恢复！`)) {
    // 实际项目中调用删除接口
    materialList.value = materialList.value.filter(item => item.id !== id)
    totalCount.value -= 1
  }
}

// 跳转到物料详情页（核心功能：使用命名路由匹配你的路由配置）
const goToDetail = (ppn) => {
  router.push({
    name: 'ModelBasicInfo', // 直接使用路由配置中的name属性（最可靠）
    query: { PPNID: ppn }   // 传递型号参数
  })
}

// 页面挂载时初始化数据
onMounted(() => {
  fetchMaterialData()
})
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 确保日期输入框与品牌输入框的内边距和边框一致 */
input[type="date"] {
  box-sizing: border-box;
}

/* 表格单元格溢出处理优化 */
.table-cell-ellipsis {
  @apply overflow-hidden text-ellipsis whitespace-nowrap;
}
</style>