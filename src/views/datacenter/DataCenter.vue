<template>
  <div class="p-6 bg-gray-50">
    <h2 class="text-xl text-left font-semibold mb-6">数据中心</h2>
    <p class="text-gray-600 text-left mb-8">欢迎使用数据中心管理系统</p>

    <!-- 顶部统计卡片 -->
      <div class="grid grid-cols-3 gap-4 mb-8">
      <div class="bg-white p-4 rounded-md shadow-sm">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-500 text-sm">物料总数</p>
            <p class="text-2xl font-semibold">{{ materialTotal }}</p>
            <p class="text-green-500 text-sm">{{ materialTotalTrend }} 较上月</p>
          </div>
          <i class="fa fa-box text-blue-500 text-3xl"></i>
        </div>
      </div>
      <div class="bg-white p-4 rounded-md shadow-sm">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-500 text-sm">分析模型型号数</p>
            <p class="text-2xl font-semibold">{{ analysisModelCount }}</p>
            <p class="text-green-500 text-sm">{{ analysisModelTrend }} 较上月</p>
          </div>
          <i class="fa fa-chart-line text-green-500 text-3xl"></i>
        </div>
      </div>
      <div class="bg-white p-4 rounded-md shadow-sm">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-500 text-sm">供应型号数</p>
            <p class="text-2xl font-semibold">{{ supplyModelCount }}</p>
            <p class="text-red-500 text-sm">{{ supplyModelTrend }} 较上月</p>
          </div>
          <i class="fa fa-truck text-purple-500 text-3xl"></i>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="grid grid-cols-2 gap-6 mb-8">
      <div class="chart-container">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-medium">物料等级分布</h3>
          <button class="text-blue-500 text-sm">导出数据</button>
        </div>
        <div ref="materialLevelChart" class="w-full h-full"></div>
      </div>
      <div class="chart-container">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-medium">产品类别分布</h3>
          <select class="text-sm border rounded px-2 py-1">
            <option>全部等级</option>
          </select>
        </div>
        <div ref="productCategoryChart" class="w-full h-full"></div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-6 mb-8">
      <div class="chart-container">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-medium">品牌分布趋势</h3>
          <div class="flex items-center">
            <select class="text-sm border rounded px-2 py-1 mr-2">
              <option>全部品牌</option>
            </select>
            <a href="#" class="text-blue-500 text-sm">查看详情</a>
          </div>
        </div>
        <div ref="brandDistributionChart" class="w-full h-full"></div>
      </div>
      <div class="chart-container">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-medium">物料分析进展</h3>
          <div class="flex items-center">
            <select class="text-sm border rounded px-2 py-1 mr-2">
              <option>全部等级</option>
            </select>
            <a href="#" class="text-blue-500 text-sm">查看详情</a>
          </div>
        </div>
        <div ref="materialAnalysisChart" class="w-full h-full"></div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-6">
      <div class="chart-container">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-medium">分析任务状态</h3>
          <a href="#" class="text-blue-500 text-sm">查看详情</a>
        </div>
        <div ref="analysisTaskChart" class="w-full h-full"></div>
      </div>
      <div class="chart-container">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-medium">监控任务状态</h3>
          <a href="#" class="text-blue-500 text-sm">查看详情</a>
        </div>
        <div ref="monitorTaskChart" class="w-full h-full"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

// 数据变量
const materialTotal = ref(0)
const materialTotalTrend = ref('')
const analysisModelCount = ref(0)
const analysisModelTrend = ref('')
const supplyModelCount = ref(0)
const supplyModelTrend = ref('')
const materialLevelData = ref({})
const productCategoryData = ref({})
const brandDistributionData = ref({})
const materialAnalysisData = ref({})
const analysisTaskData = ref({})
const monitorTaskData = ref({})

// ECharts 实例引用
const materialLevelChart = ref(null)
const productCategoryChart = ref(null)
const brandDistributionChart = ref(null)
const materialAnalysisChart = ref(null)
const analysisTaskChart = ref(null)
const monitorTaskChart = ref(null)

// 模拟网络请求获取数据
const fetchData = async () => {
  try {
    // 从 public 文件夹读取 JSON
    const response = await fetch('/datacenter.json')
    const data = await response.json()

    // 赋值数据
    materialTotal.value = data.materialTotal
    materialTotalTrend.value = data.materialTotalTrend
    analysisModelCount.value = data.analysisModelCount
    analysisModelTrend.value = data.analysisModelTrend
    supplyModelCount.value = data.supplyModelCount
    supplyModelTrend.value = data.supplyModelTrend
    materialLevelData.value = data.materialLevelDistribution
    productCategoryData.value = data.productCategoryDistribution
    brandDistributionData.value = data.brandDistributionTrend
    materialAnalysisData.value = data.materialAnalysisProgress
    analysisTaskData.value = data.analysisTaskStatus
    monitorTaskData.value = data.monitorTaskStatus

    // 初始化图表
    initCharts()
  } catch (error) {
    console.error('数据获取失败:', error)
  }
}

// 初始化 ECharts 图表
const initCharts = () => {
  // 物料等级分布（柱状图）
  const materialLevelInstance = echarts.init(materialLevelChart.value)
  materialLevelInstance.setOption({
    xAxis: {
      type: 'category',
      data: materialLevelData.value.xAxis
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: materialLevelData.value.series,
        type: 'bar',
        color: '#4285F4'
      }
    ]
  })

  // 产品类别分布（条形图）
  const productCategoryInstance = echarts.init(productCategoryChart.value)
  productCategoryInstance.setOption({
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: productCategoryData.value.xAxis
    },
    series: [
      {
        data: productCategoryData.value.series,
        type: 'bar',
        color: '#34A853',
        barWidth: '40%'
      }
    ]
  })

  // 品牌分布趋势（折线图）
  const brandDistributionInstance = echarts.init(brandDistributionChart.value)
  brandDistributionInstance.setOption({
    xAxis: {
      type: 'category',
      data: brandDistributionData.value.xAxis
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'TI',
        data: brandDistributionData.value.series.TI,
        type: 'line',
        color: '#4285F4'
      },
      {
        name: 'ADI',
        data: brandDistributionData.value.series.ADI,
        type: 'line',
        color: '#FBBC05'
      },
      {
        name: 'RENESAS',
        data: brandDistributionData.value.series.RENESAS,
        type: 'line',
        color: '#EA4335'
      },
      {
        name: 'INFINEON',
        data: brandDistributionData.value.series.INFINEON,
        type: 'line',
        color: '#34A853'
      },
      {
        name: 'NXP',
        data: brandDistributionData.value.series.NXP,
        type: 'line',
        color: '#4A148C'
      }
    ]
  })

  // 物料分析进展（折线图）
  const materialAnalysisInstance = echarts.init(materialAnalysisChart.value)
  materialAnalysisInstance.setOption({
    xAxis: {
      type: 'category',
      data: materialAnalysisData.value.xAxis
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'A类',
        data: materialAnalysisData.value.series.A类,
        type: 'line',
        color: '#4285F4'
      },
      {
        name: 'B类',
        data: materialAnalysisData.value.series.B类,
        type: 'line',
        color: '#FBBC05'
      },
      {
        name: 'C类',
        data: materialAnalysisData.value.series.C类,
        type: 'line',
        color: '#EA4335'
      },
      {
        name: 'D类',
        data: materialAnalysisData.value.series.D类,
        type: 'line',
        color: '#34A853'
      },
      {
        name: 'E类',
        data: materialAnalysisData.value.series.E类,
        type: 'line',
        color: '#4A148C'
      }
    ]
  })

  // 分析任务状态（饼图）
  const analysisTaskInstance = echarts.init(analysisTaskChart.value)
  analysisTaskInstance.setOption({
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        data: analysisTaskData.value.data,
        label: {
          show: true,
          formatter: '{b}: {c}'
        },
        colors: ['#4285F4', '#34A853', '#FBBC05']
      }
    ]
  })

  // 监控任务状态（饼图）
  const monitorTaskInstance = echarts.init(monitorTaskChart.value)
  monitorTaskInstance.setOption({
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        data: monitorTaskData.value.data,
        label: {
          show: true,
          formatter: '{b}: {c}'
        },
        colors: ['#4285F4', '#34A853', '#EA4335']
      }
    ]
  })

  // 监听窗口大小变化，自动调整图表尺寸
  window.addEventListener('resize', () => {
    materialLevelInstance.resize()
    productCategoryInstance.resize()
    brandDistributionInstance.resize()
    materialAnalysisInstance.resize()
    analysisTaskInstance.resize()
    monitorTaskInstance.resize()
  })
}

// 页面挂载时获取数据并初始化图表
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .chart-container {
    @apply bg-white px-4 py-6 rounded-md shadow-sm h-96;
  }
}
</style>