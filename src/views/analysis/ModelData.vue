<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- 顶部面包屑 -->
    <div class="flex items-center mb-4">
      <button
        @click="goBack"
        class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 mr-3"
      >
        <i class="fa fa-arrow-left mr-1.5"></i>返回
      </button>
      <h2 class="text-xl font-semibold text-gray-900">分析管理 > 型号详情</h2>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="bg-white rounded-md shadow-sm p-12 text-center text-gray-500">
      <i class="fa fa-spinner fa-spin mr-2"></i>加载中...
    </div>

    <!-- 未找到型号 -->
    <div v-else-if="!material" class="bg-white rounded-md shadow-sm p-12 text-center text-gray-500">
      <i class="fa fa-exclamation-circle mr-2"></i>未找到对应的型号信息
    </div>

    <template v-else>
      <!-- 1. 型号信息卡片 -->
      <div class="bg-white rounded-md shadow-sm p-5 mb-4">
        <div class="flex items-start justify-between">
          <div class="flex items-center">
            <i class="fa fa-microchip text-blue-600 text-2xl mr-3"></i>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ material.model }}</h3>
              <div class="flex items-center mt-1.5 space-x-3 text-sm">
                <span class="text-gray-500">品牌：{{ material.brand }}</span>
                <span
                  class="px-2 py-0.5 inline-flex text-xs font-semibold rounded-full"
                  :class="material.status === 'Active' ? 'bg-green-100 text-green-800' : material.status === 'Inactive' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'"
                >
                  {{ material.status }}
                </span>
              </div>
              <p class="text-sm text-gray-500 mt-1">
                {{ material.productCategory }}
                <template v-if="material.productSubCategory"> / {{ material.productSubCategory }}</template>
                <template v-if="material.series"> / {{ material.series }}</template>
              </p>
            </div>
          </div>
          <button class="px-4 py-1.5 bg-gray-300 text-white text-sm rounded-md hover:bg-blue-700 inline-flex items-center">
            查看详情 <i class="fa fa-arrow-right ml-1.5 text-xs"></i>
          </button>
        </div>
      </div>

      <!-- 2. 得分概览卡片 -->
      <div class="bg-white rounded-md shadow-sm p-5 mb-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p class="text-sm text-gray-500 mb-1">更新日期</p>
            <p class="text-lg font-semibold text-gray-900">{{ material.updateDate }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">综合得分</p>
            <div class="flex items-center space-x-3">
              <span class="text-3xl font-bold text-gray-900">{{ material.score }}</span>
              <div class="flex-1 max-w-xs">
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="h-2.5 rounded-full transition-all"
                    :class="scoreProgressClass"
                    :style="{ width: Math.min(100, material.score) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">物料等级</p>
            <span
              class="px-3 py-1 inline-flex text-sm font-semibold rounded-full"
              :class="gradeStyles[material.grade] || 'bg-gray-100 text-gray-800'"
            >
              {{ material.grade }} 类
            </span>
          </div>
        </div>
      </div>

      <!-- 3. 需求信息 -->
      <div class="bg-white rounded-md shadow-sm p-5 mb-4">
        <h3 class="text-base font-medium text-gray-900 mb-4">需求信息</h3>

        <!-- KPI 卡片 -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="border border-gray-100 rounded-md p-4">
            <p class="text-xs text-gray-500 mb-1">H-A</p>
            <p class="text-2xl font-bold text-gray-900">{{ demandData.hA.toLocaleString() }}</p>
            <p class="text-xs text-gray-400 mt-1">华强月度搜索指数均值</p>
          </div>
          <div class="border border-gray-100 rounded-md p-4">
            <p class="text-xs text-gray-500 mb-1">H-L</p>
            <p class="text-2xl font-bold text-gray-900">{{ demandData.hL.toLocaleString() }}</p>
            <p class="text-xs text-gray-400 mt-1">华强网上搜索指数</p>
          </div>
          <div class="border border-gray-100 rounded-md p-4">
            <p class="text-xs text-gray-500 mb-1">W-W</p>
            <p class="text-2xl font-bold text-gray-900">{{ demandData.wW.toLocaleString() }}</p>
            <p class="text-xs text-gray-400 mt-1">华强网上记录</p>
          </div>
          <div class="border border-gray-100 rounded-md p-4">
            <p class="text-xs text-gray-500 mb-1">W-R</p>
            <p class="text-2xl font-bold text-gray-900">{{ demandData.wR.toLocaleString() }}</p>
            <p class="text-xs text-gray-400 mt-1">俄罗斯进口记录</p>
          </div>
        </div>

        <!-- 趋势图 2x2 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="border border-gray-100 rounded-md p-3">
            <p class="text-sm text-gray-700 mb-2 text-center">华强网过去12个月搜索指数</p>
            <div ref="chartHuaqiang1" class="w-full h-40"></div>
          </div>
          <div class="border border-gray-100 rounded-md p-3">
            <p class="text-sm text-gray-700 mb-2 text-center">华强网过去12周搜索指数</p>
            <div ref="chartHuaqiang2" class="w-full h-40"></div>
          </div>
          <div class="border border-gray-100 rounded-md p-3">
            <p class="text-sm text-gray-700 mb-2 text-center">IC交易网过去12个月搜索指数</p>
            <div ref="chartIcTrade1" class="w-full h-40"></div>
          </div>
          <div class="border border-gray-100 rounded-md p-3">
            <p class="text-sm text-gray-700 mb-2 text-center">IC交易网过去12周搜索指数</p>
            <div ref="chartIcTrade2" class="w-full h-40"></div>
          </div>
        </div>
      </div>

      <!-- 4. 供给信息 -->
      <div class="bg-white rounded-md shadow-sm p-5 mb-4">
        <h3 class="text-base font-medium text-gray-900 mb-4">供给信息</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="border border-gray-100 rounded-md p-3">
            <p class="text-sm text-gray-700 mb-2 text-center">供应商数量对比</p>
            <div ref="chartSupplier" class="w-full h-48"></div>
          </div>
          <div class="border border-gray-100 rounded-md p-3">
            <p class="text-sm text-gray-700 mb-2 text-center">Octopart近一年库存波动</p>
            <div ref="chartOctopart" class="w-full h-48"></div>
          </div>
        </div>
      </div>

      <!-- 5. 价格参考 -->
      <div class="bg-white rounded-md shadow-sm p-5">
        <h3 class="text-base font-medium text-gray-900 mb-4">价格参考</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="border border-gray-100 rounded-md p-4">
            <p class="text-xs text-gray-500 mb-1">P-B</p>
            <p class="text-2xl font-bold text-gray-900">{{ priceData.pB }}</p>
            <p class="text-xs text-gray-400 mt-1">正能量价格</p>
          </div>
          <div class="border border-gray-100 rounded-md p-4">
            <p class="text-xs text-gray-500 mb-1">P-O</p>
            <p class="text-2xl font-bold text-gray-900">{{ priceData.pO }}</p>
            <p class="text-xs text-gray-400 mt-1">Octopart参考价格</p>
          </div>
          <div class="border border-gray-100 rounded-md p-4">
            <p class="text-xs text-gray-500 mb-1">P-R</p>
            <p class="text-2xl font-bold text-gray-900">{{ priceData.pR }}</p>
            <p class="text-xs text-gray-400 mt-1">价格系数</p>
          </div>
          <div class="border border-gray-100 rounded-md p-4 bg-blue-50">
            <p class="text-xs text-gray-500 mb-1">备项目标价格</p>
            <p class="text-2xl font-bold text-blue-700">{{ priceData.targetPrice }}</p>
            <p class="text-xs text-gray-400 mt-1">建议采购价格</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as echarts from 'echarts'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const material = ref(null)

// 图表 DOM 引用
const chartHuaqiang1 = ref(null)
const chartHuaqiang2 = ref(null)
const chartIcTrade1 = ref(null)
const chartIcTrade2 = ref(null)
const chartSupplier = ref(null)
const chartOctopart = ref(null)

let chartInstances = []

const gradeStyles = {
  'A+': 'bg-blue-100 text-blue-800',
  'A': 'bg-green-100 text-green-800',
  'B+': 'bg-yellow-100 text-yellow-800',
  'B': 'bg-orange-100 text-orange-800',
  'C': 'bg-red-100 text-red-800'
}

const scoreProgressClass = computed(() => {
  const score = material.value?.score || 0
  if (score >= 90) return 'bg-green-500'
  if (score >= 80) return 'bg-blue-500'
  if (score >= 70) return 'bg-yellow-500'
  return 'bg-red-500'
})

// 简单的字符串哈希生成器，用于基于型号名生成稳定的模拟数据
const hashString = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

// 基于哈希的伪随机数生成器
const seededRandom = (seed) => {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

// 月份标签
const getMonthLabels = () => {
  const labels = []
  const now = new Date()
  for (let i = 11; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
    labels.push(`${month.getMonth() + 1}月`)
  }
  return labels
}

// 生成12个月的趋势数据
const generateTrend = (seed, base, variance) => {
  const random = seededRandom(seed)
  const result = []
  let value = base
  for (let i = 0; i < 12; i++) {
    value += (random() - 0.4) * variance
    value = Math.max(0, Math.round(value))
    result.push(value)
  }
  return result
}

// 生成需求信息数据
const demandData = computed(() => {
  if (!material.value) return { hA: 0, hL: 0, wW: 0, wR: 0 }
  const seed = hashString(material.value.model)
  const random = seededRandom(seed)
  return {
    hA: Math.round(800 + random() * 800),
    hL: Math.round(900 + random() * 900),
    wW: Math.round(1500 + random() * 2000),
    wR: Math.round(200 + random() * 400)
  }
})

// 生成价格数据
const priceData = computed(() => {
  if (!material.value) return { pB: '¥0.00', pO: '¥0.00', pR: '0.00', targetPrice: '¥0.00' }
  const seed = hashString(material.value.model)
  const random = seededRandom(seed)
  const basePrice = 8 + random() * 12
  const pB = basePrice.toFixed(2)
  const pO = (basePrice * (1 + random() * 0.2 + 0.05)).toFixed(2)
  const pR = (1 + random() * 0.3 + 0.05).toFixed(2)
  const target = (basePrice * (1 + random() * 0.15)).toFixed(2)
  return {
    pB: `¥${pB}`,
    pO: `¥${pO}`,
    pR: pR,
    targetPrice: `¥${target}`
  }
})

// 初始化单个图表
const initLineChart = (domRef, data, color, height = 160) => {
  if (!domRef.value) return null
  const chart = echarts.init(domRef.value)
  chartInstances.push(chart)
  const months = getMonthLabels()
  chart.setOption({
    grid: { left: 35, right: 10, top: 10, bottom: 20 },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => `${months[params[0].dataIndex]}: ${params[0].value.toLocaleString()}`
    },
    xAxis: {
      type: 'category',
      data: months,
      axisLabel: { color: '#9ca3af', fontSize: 10 },
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#9ca3af', fontSize: 10 },
      splitLine: { lineStyle: { color: '#f3f4f6' } }
    },
    series: [{
      data,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 4,
      lineStyle: { color, width: 2 },
      itemStyle: { color },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: color + '30' },
          { offset: 1, color: color + '00' }
        ])
      }
    }]
  })
  return chart
}

const initBarChart = (domRef, data) => {
  if (!domRef.value) return null
  const chart = echarts.init(domRef.value)
  chartInstances.push(chart)
  chart.setOption({
    grid: { left: 40, right: 10, top: 20, bottom: 30 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      data: ['IC交易网', '华强网'],
      bottom: 0,
      textStyle: { color: '#6b7280', fontSize: 11 },
      itemWidth: 12,
      itemHeight: 8
    },
    xAxis: {
      type: 'category',
      data: ['供应商家数', '现货商家数'],
      axisLabel: { color: '#9ca3af', fontSize: 10 },
      axisLine: { lineStyle: { color: '#e5e7eb' } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#9ca3af', fontSize: 10 },
      splitLine: { lineStyle: { color: '#f3f4f6' } }
    },
    series: [
      {
        name: 'IC交易网',
        type: 'bar',
        data: data.icTrade,
        itemStyle: { color: '#3b82f6', borderRadius: [3, 3, 0, 0] },
        barWidth: 30
      },
      {
        name: '华强网',
        type: 'bar',
        data: data.huaqiang,
        itemStyle: { color: '#93c5fd', borderRadius: [3, 3, 0, 0] },
        barWidth: 30
      }
    ]
  })
  return chart
}

// 初始化所有图表
const initAllCharts = () => {
  chartInstances.forEach(c => c && !c.isDisposed() && c.dispose())
  chartInstances = []

  if (!material.value) return

  const seed = hashString(material.value.model)
  const random = seededRandom(seed)

  // 生成各系列数据
  const hqMonthData = generateTrend(seed, 600 + random() * 400, 80)
  const hqWeekData = generateTrend(seed + 1, 700 + random() * 500, 100)
  const icMonthData = generateTrend(seed + 2, 500 + random() * 400, 60)
  const icWeekData = generateTrend(seed + 3, 600 + random() * 500, 80)
  const octopartData = generateTrend(seed + 4, 100 + random() * 150, 30)

  initLineChart(chartHuaqiang1, hqMonthData, '#3b82f6')
  initLineChart(chartHuaqiang2, hqWeekData, '#60a5fa')
  initLineChart(chartIcTrade1, icMonthData, '#10b981')
  initLineChart(chartIcTrade2, icWeekData, '#34d399')

  // 供应商数据
  const icTradeSuppliers = Math.round(80 + random() * 40)
  const hqSuppliers = Math.round(60 + random() * 40)
  initBarChart(chartSupplier, {
    icTrade: [icTradeSuppliers, Math.round(icTradeSuppliers * 0.6)],
    huaqiang: [hqSuppliers, Math.round(hqSuppliers * 0.5)]
  })

  initLineChart(chartOctopart, octopartData, '#f59e0b')
}

// 加载型号详情数据
const fetchModelDetail = async () => {
  loading.value = true
  try {
    const model = decodeURIComponent(route.params.model)

    // 先尝试从 PPNAnalyData.json 查找
    let response
    try {
      response = await fetch('/PPNAnalyData.json')
    } catch {
      response = null
    }

    if (response && response.ok) {
      const data = await response.json()
      const found = (data.materialList || []).find(m => m.model === model)
      if (found) {
        material.value = {
          ...found,
          series: found.series || '',
          inventoryTrend: found.inventoryTrend || Array(12).fill(50)
        }
      }
    }

    // 如果没找到，尝试从 TaskManagement.json 查找
    if (!material.value) {
      try {
        const res2 = await fetch('/TaskManagement.json')
        if (res2.ok) {
          const tasks = await res2.json()
          for (const task of tasks.taskList || []) {
            const found = (task.models || []).find(m => m.model === model)
            if (found) {
              material.value = { ...found, series: '' }
              break
            }
          }
        }
      } catch { /* ignore */ }
    }

    if (!material.value) {
      // 生成一条示例数据
      material.value = {
        model,
        brand: '-',
        status: 'Active',
        updateDate: new Date().toISOString().split('T')[0],
        productCategory: '-',
        productSubCategory: '-',
        score: 75,
        grade: 'B',
        hA: 80, hL: 75, sU: 78, wW: 82, wR: 76, pR: 85,
        inventoryTrend: Array(12).fill(50),
        series: ''
      }
    }

    await nextTick()
    initAllCharts()
  } catch (error) {
    console.error('获取型号详情失败:', error)
    material.value = null
  } finally {
    loading.value = false
  }
}

// 返回
const goBack = () => {
  router.push('/analysis/query')
}

// 窗口 resize
const handleResize = () => {
  chartInstances.forEach(c => c && !c.isDisposed() && c.resize())
}

onMounted(() => {
  fetchModelDetail()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartInstances.forEach(c => c && !c.isDisposed() && c.dispose())
  chartInstances = []
})
</script>

<style scoped>
td, th { white-space: nowrap; }
</style>
