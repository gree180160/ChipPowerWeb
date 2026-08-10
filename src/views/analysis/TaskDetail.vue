<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- 顶部：返回按钮 + 任务信息 -->
    <div class="flex items-center mb-6">
      <button
        @click="goBack"
        class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 mr-3"
      >
        <i class="fa fa-arrow-left mr-1.5"></i>返回
      </button>
      <h2 class="text-xl font-semibold text-gray-900">分析管理 > 任务详情</h2>
    </div>

    <!-- 任务信息卡片 -->
    <div v-if="task" class="bg-white rounded-md shadow-sm p-4 mb-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <i class="fa fa-tasks text-blue-600 text-xl mr-3"></i>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ task.taskName }}</h3>
            <p class="text-sm text-gray-500">任务编号：{{ task.taskId }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-4 text-sm">
          <span class="text-gray-500">型号数量：<span class="font-semibold text-gray-900">{{ task.modelCount }}</span></span>
          <span class="text-gray-500">优先级：<span class="font-semibold text-gray-900">P{{ task.priority }}</span></span>
          <span class="px-3 py-1 inline-flex text-sm font-semibold rounded-full" :class="statusStyles[task.status]">
            {{ task.status }}
          </span>
        </div>
      </div>
    </div>

    <!-- 筛选条件区域 -->
    <div class="bg-white p-4 rounded-md shadow-sm mb-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4 text-left">筛选条件</h3>

      <!-- 第一行筛选：型号、品牌、产品类别 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1">型号</label>
          <input v-model="searchParams.model" type="text" placeholder="输入型号"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm w-full" />
        </div>
        <div class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1">品牌</label>
          <select v-model="searchParams.brand" class="px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option v-for="item in brandOptions" :key="item" :value="item">{{ item }}</option>
          </select>
        </div>
        <div class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1">产品类别</label>
          <select v-model="searchParams.productCategory" class="px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option v-for="item in productCategoryOptions" :key="item" :value="item">{{ item }}</option>
          </select>
        </div>
      </div>

      <!-- 第二行筛选：更新日期、得分范围、状态 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1">更新日期</label>
          <div class="flex items-center w-full">
            <input v-model="searchParams.startDate" type="date"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm flex-1" />
            <span class="text-gray-500 whitespace-nowrap mx-2">至</span>
            <input v-model="searchParams.endDate" type="date"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm flex-1" />
          </div>
        </div>
        <div class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1">得分范围</label>
          <div class="flex items-center w-full space-x-2">
            <input v-model="searchParams.minScore" type="number" placeholder="最小值"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm flex-1 min-w-0" />
            <span class="text-gray-500 shrink-0">-</span>
            <input v-model="searchParams.maxScore" type="number" placeholder="最大值"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm flex-1 min-w-0" />
          </div>
        </div>
        <div class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1">状态</label>
          <select v-model="searchParams.status" class="px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option v-for="item in statusOptions" :key="item" :value="item">{{ item }}</option>
          </select>
        </div>
      </div>

      <!-- 第三行筛选：物料等级 + 按钮区域 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1">物料等级</label>
          <select v-model="searchParams.materialGrade" class="px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option v-for="item in materialGradeOptions" :key="item" :value="item">{{ item }}</option>
          </select>
        </div>
        <div></div>
        <div class="flex justify-end space-x-3">
          <button class="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50" @click="resetSearch">
            重置
          </button>
          <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" @click="fetchData">
            <i class="fa fa-search mr-1"></i>查询
          </button>
        </div>
      </div>
    </div>

    <!-- 物料列表表格 -->
    <div class="bg-white rounded-md shadow-sm overflow-hidden mb-6">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">型号</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">品牌</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">更新日期</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">产品大类</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">产品小类</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">得分</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">等级</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">H-A</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">H-L</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S-U</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">W-W</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">W-R</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P-R</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">趋势图</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="16" class="px-6 py-8 text-center text-gray-500">
                <i class="fa fa-spinner fa-spin mr-2"></i>加载中...
              </td>
            </tr>
            <tr v-else-if="!pagedList.length">
              <td colspan="16" class="px-6 py-8 text-center text-gray-500">
                <i class="fa fa-search-minus mr-2"></i>暂无数据
              </td>
            </tr>
            <tr v-else v-for="(item, idx) in pagedList" :key="item.model" class="hover:bg-gray-50">
              <td class="px-4 py-3 whitespace-nowrap text-sm">
              <button class="text-blue-600 hover:text-blue-900 hover:underline font-medium" @click="goToModel(item.model)">{{ item.model }}</button>
            </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ item.brand }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="item.status === 'Active' ? 'bg-green-100 text-green-800' :
                         item.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                         'bg-yellow-100 text-yellow-800'">
                  {{ item.status }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ item.updateDate }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ item.productCategory }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ item.productSubCategory }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ item.score }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="gradeStyles[item.grade] || 'bg-gray-100 text-gray-800'">
                  {{ item.grade }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ item.hA }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ item.hL }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ item.sU }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ item.wW }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ item.wR }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ item.pR }}</td>
              <td class="px-4 py-3 whitespace-nowrap" style="min-width: 180px;">
                <div :id="`chart-${idx}`" class="w-full h-16"></div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-900" @click="goToModel(item.model)">
                  <i class="fa fa-eye mr-1"></i>查看详情
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 分页控件 -->
    <div class="flex justify-between items-center" v-if="totalCount > 0">
      <div class="text-sm text-gray-500">
        显示 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, totalCount) }} 条，共 {{ totalCount }} 条
      </div>
      <div class="flex items-center space-x-2">
        <button class="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
          :disabled="currentPage === 1 || loading" @click="changePage(currentPage - 1)">
          <i class="fa fa-chevron-left text-xs"></i>
        </button>
        <button v-for="page in pageRange" :key="page"
          class="px-3 py-1 border border-gray-300 rounded-md text-sm"
          :class="currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-700 hover:bg-gray-50'"
          :disabled="loading" @click="changePage(page)">
          {{ page }}
        </button>
        <button class="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
          :disabled="currentPage === totalPages || loading" @click="changePage(currentPage + 1)">
          <i class="fa fa-chevron-right text-xs"></i>
        </button>
        <div class="flex items-center ml-2">
          <span class="text-sm text-gray-500 mr-1">前往</span>
          <input v-model.number="jumpPage" type="number" min="1" :max="totalPages"
            class="w-14 px-2 py-1 border border-gray-300 rounded-md text-sm text-center" />
          <span class="text-sm text-gray-500 ml-1">页</span>
          <button class="ml-1 px-2 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            :disabled="!jumpPage || jumpPage < 1 || jumpPage > totalPages" @click="jumpToPage">
            确定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as echarts from 'echarts'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const task = ref(null)
const allModels = ref([])
const filteredList = ref([])
const chartInstances = {}

const currentPage = ref(1)
const pageSize = ref(10)
const jumpPage = ref(null)

const searchParams = ref({
  model: '',
  brand: '-all-',
  productCategory: '-all-',
  startDate: '',
  endDate: '',
  minScore: '',
  maxScore: '',
  status: '-all-',
  materialGrade: '-all-'
})

const statusStyles = {
  '未开始': 'bg-gray-100 text-gray-800',
  '运行中': 'bg-blue-100 text-blue-800',
  '已完成': 'bg-green-100 text-green-800',
  '已暂停': 'bg-yellow-100 text-yellow-800',
  '已失败': 'bg-red-100 text-red-800'
}

const gradeStyles = {
  'A+': 'bg-blue-100 text-blue-800',
  'A': 'bg-green-100 text-green-800',
  'B+': 'bg-yellow-100 text-yellow-800',
  'B': 'bg-orange-100 text-orange-800',
  'C': 'bg-red-100 text-red-800'
}

const brandOptions = ref(['-all-'])
const productCategoryOptions = ref(['-all-'])
const statusOptions = ref(['-all-', 'Active', 'Inactive', 'Pending'])
const materialGradeOptions = ref(['-all-', 'A+', 'A', 'B+', 'B', 'C'])

const totalCount = computed(() => filteredList.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / pageSize.value)))

const pagedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredList.value.slice(start, start + pageSize.value)
})

const pageRange = computed(() => {
  const range = []
  const maxShow = 5
  if (totalPages.value === 0) return range
  let start = Math.max(1, currentPage.value - Math.floor(maxShow / 2))
  let end = start + maxShow - 1
  if (end > totalPages.value) {
    end = totalPages.value
    start = Math.max(1, end - maxShow + 1)
  }
  for (let i = start; i <= end; i++) range.push(i)
  return range
})

const getMonthLabels = () => {
  const labels = []
  const now = new Date()
  for (let i = 11; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
    labels.push(`${month.getMonth() + 1}月`)
  }
  return labels
}

const initCharts = () => {
  Object.values(chartInstances).forEach(c => c && !c.isDisposed() && c.dispose())
  Object.keys(chartInstances).forEach(k => delete chartInstances[k])

  const monthLabels = getMonthLabels()
  pagedList.value.forEach((item, index) => {
    const chartId = `chart-${index}`
    const dom = document.getElementById(chartId)
    if (!dom) return
    try {
      const chart = echarts.init(dom)
      chartInstances[chartId] = chart
      chart.setOption({
        grid: { left: 0, right: 0, top: 2, bottom: 2, containLabel: false },
        xAxis: { type: 'category', data: monthLabels, show: false },
        yAxis: { type: 'value', show: false },
        tooltip: {
          trigger: 'axis',
          formatter: p => `${monthLabels[p[0].dataIndex]}: ${p[0].value}`
        },
        series: [{
          data: item.inventoryTrend || Array(12).fill(50),
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { color: '#3b82f6', width: 2 },
          areaStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
                { offset: 1, color: 'rgba(59, 130, 246, 0)' }
              ]
            }
          }
        }]
      })
      const handler = () => chart.resize()
      window.addEventListener('resize', handler)
      chart.resizeHandler = handler
    } catch (e) {
      console.error('图表初始化失败:', chartId, e)
    }
  })
}

const applyFilter = () => {
  let list = [...allModels.value]
  const p = searchParams.value
  if (p.model) list = list.filter(i => i.model.toLowerCase().includes(p.model.toLowerCase()))
  if (p.brand !== '-all-') list = list.filter(i => i.brand === p.brand)
  if (p.productCategory !== '-all-') list = list.filter(i => i.productCategory === p.productCategory)
  if (p.status !== '-all-') list = list.filter(i => i.status === p.status)
  if (p.materialGrade !== '-all-') list = list.filter(i => i.grade === p.materialGrade)
  if (p.minScore !== '') list = list.filter(i => i.score >= Number(p.minScore))
  if (p.maxScore !== '') list = list.filter(i => i.score <= Number(p.maxScore))
  if (p.startDate) list = list.filter(i => i.updateDate >= p.startDate)
  if (p.endDate) list = list.filter(i => i.updateDate <= p.endDate)
  filteredList.value = list
  currentPage.value = 1
  nextTick(() => initCharts())
}

const fetchData = async () => {
  loading.value = true
  try {
    const taskId = route.params.taskId
    const res = await fetch('/TaskManagement.json')
    const data = await res.json()
    const found = (data.taskList || []).find(t => t.taskId === taskId)
    if (!found) {
      task.value = null
      allModels.value = []
      filteredList.value = []
      return
    }
    task.value = found
    const models = found.models || []
    allModels.value = models.map(m => ({
      ...m,
      inventoryTrend: m.inventoryTrend || Array(12).fill(50)
    }))

    // 更新下拉选项
    const brands = ['-all-', ...new Set(models.map(m => m.brand))]
    const cats = ['-all-', ...new Set(models.map(m => m.productCategory))]
    brandOptions.value = brands
    productCategoryOptions.value = cats

    applyFilter()
  } catch (e) {
    console.error('加载任务详情失败:', e)
    task.value = null
    allModels.value = []
    filteredList.value = []
  } finally {
    loading.value = false
  }
}

const resetSearch = () => {
  searchParams.value = {
    model: '', brand: '-all-', productCategory: '-all-',
    startDate: '', endDate: '', minScore: '', maxScore: '',
    status: '-all-', materialGrade: '-all-'
  }
  applyFilter()
}

const changePage = (page) => {
  if (page < 1 || page > totalPages.value || loading.value) return
  currentPage.value = page
  nextTick(() => initCharts())
}

const jumpToPage = () => {
  if (!jumpPage.value || jumpPage.value < 1 || jumpPage.value > totalPages.value) return
  currentPage.value = jumpPage.value
  nextTick(() => initCharts())
}

const goBack = () => {
  router.push('/analysis/task')
}

const goToModel = (model) => {
  router.push(`/analysis/query/model/${encodeURIComponent(model)}`)
}

onMounted(() => {
  fetchData()
})

onBeforeUnmount(() => {
  Object.values(chartInstances).forEach(c => {
    if (c && !c.isDisposed()) {
      if (c.resizeHandler) window.removeEventListener('resize', c.resizeHandler)
      c.dispose()
    }
  })
})
</script>

<style scoped>
label { text-align: left !important; display: block; }
.overflow-x-auto { scrollbar-width: thin; scrollbar-color: #cbd5e0 #f7fafc; }
.overflow-x-auto::-webkit-scrollbar { height: 6px; }
.overflow-x-auto::-webkit-scrollbar-track { background: #f7fafc; }
.overflow-x-auto::-webkit-scrollbar-thumb { background-color: #cbd5e0; border-radius: 3px; }
td, th { white-space: nowrap; }
[id^="chart-"] { min-height: 60px; }
</style>
