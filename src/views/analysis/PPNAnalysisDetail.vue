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
          <div>
            <div class="flex items-center gap-2.5">
              <h3 class="text-xl font-semibold text-gray-900">{{ material.model }}</h3>
              <span
                v-if="material.status"
                class="shrink-0 px-2 py-0.5 text-xs font-medium rounded-full"
                :class="material.status === 'Active' ? 'bg-green-50 text-green-700' : material.status === 'Inactive' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'"
              >
                {{ material.status }}
              </span>
            </div>
            <div class="flex items-center flex-wrap gap-x-2 gap-y-1 mt-2 text-sm">
              <span class="text-gray-400">品牌: </span>
              <span class="text-gray-700 font-medium">{{ material.brand || '--' }}</span>
            </div>
            <div class="flex items-center flex-wrap gap-x-2 gap-y-1 mt-2 text-sm">
              <span class="text-gray-400">分类: </span>
              <span class="text-gray-700">
                {{ material.productCategory }}<template v-if="material.productSubCategory"> / {{ material.productSubCategory }}</template><template v-if="material.series"> / {{ material.series }}</template>
              </span>
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
            <p class="text-lg font-semibold text-gray-900">{{ formatVal(material.updateDate) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">综合得分</p>
            <div class="flex items-center space-x-3">
              <span class="text-3xl font-bold text-gray-900">{{ formatScore(material.score) }}</span>
              <div class="flex-1 max-w-xs" v-if="material.score != null">
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
              v-if="material.grade"
              class="px-3 py-1 inline-flex text-sm font-semibold rounded-full"
              :class="gradeStyles[material.grade] || 'bg-gray-100 text-gray-800'"
            >
              {{ material.grade }} 类
            </span>
            <span v-else class="text-2xl font-bold text-gray-900">--</span>
          </div>
        </div>
      </div>

      <!-- 3. 需求信息 -->
      <div class="bg-white rounded-md shadow-sm p-5 mb-4">
        <h3 class="text-base font-medium text-gray-900 mb-4">需求信息</h3>

        <!-- KPI 卡片 -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="border border-gray-100 rounded-md p-4">
            <p class="text-2xl font-bold text-gray-900">{{ formatVal(demandData.hA) }}</p>
            <p class="text-xs text-gray-400 mt-1">华强月度搜索指数均值</p>
          </div>
          <div class="border border-gray-100 rounded-md p-4">
            <p class="text-2xl font-bold text-gray-900">{{ formatVal(demandData.hL) }}</p>
            <p class="text-xs text-gray-400 mt-1">华强周度搜索指数均值</p>
          </div>
          <div class="border border-gray-100 rounded-md p-4">
            <p class="text-2xl font-bold text-gray-900">{{ formatVal(demandData.wW) }}</p>
            <p class="text-xs text-gray-400 mt-1">IC月搜索量</p>
          </div>
          <div class="border border-gray-100 rounded-md p-4">
            <p class="text-2xl font-bold text-gray-900">{{ formatVal(demandData.wR) }}</p>
            <p class="text-xs text-gray-400 mt-1">俄罗斯进口记录</p>
          </div>
        </div>

        <!-- 趋势图 2x2 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="border border-gray-100 rounded-md p-3">
            <p class="text-sm text-gray-700 mb-2 text-center">华强网过去{{ hqHotData.monthHotArray.length || 'N' }}个月搜索指数</p>
            <div ref="chartHuaqiang1" class="w-full h-40"></div>
          </div>
          <div class="border border-gray-100 rounded-md p-3">
            <p class="text-sm text-gray-700 mb-2 text-center">华强网过去{{ hqHotData.weakHotArray.length || 'N' }}周搜索指数</p>
            <div ref="chartHuaqiang2" class="w-full h-40"></div>
          </div>
          <!-- IC交易网图表暂隐藏:暂无法爬取到数据 -->
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
          <div class="border border-gray-100 rounded-md p-3">
            <p class="text-sm text-gray-700 mb-2 text-center">华强网过去{{ hqStockPriceData.weekStockArray.length || 'N' }}周库存变化</p>
            <div ref="chartHqStockWeek" class="w-full h-48"></div>
          </div>
          <div class="border border-gray-100 rounded-md p-3">
            <p class="text-sm text-gray-700 mb-2 text-center">华强网过去{{ hqStockPriceData.monthStockArray.length || 'N' }}个月库存变化</p>
            <div ref="chartHqStockMonth" class="w-full h-48"></div>
          </div>
        </div>
      </div>

      <!-- 5. 价格参考 -->
      <div class="bg-white rounded-md shadow-sm p-5">
        <h3 class="text-base font-medium text-gray-900 mb-4">价格参考</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="border border-gray-100 rounded-md p-4">
            <p class="text-xs text-gray-500 mb-1">P-B</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatVal(priceData.pB) }}</p>
            <p class="text-xs text-gray-400 mt-1">正能量价格</p>
          </div>
          <div class="border border-gray-100 rounded-md p-4">
            <p class="text-xs text-gray-500 mb-1">P-O</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatVal(priceData.pO) }}</p>
            <p class="text-xs text-gray-400 mt-1">Octopart参考价格</p>
          </div>
          <div class="border border-gray-100 rounded-md p-4">
            <p class="text-xs text-gray-500 mb-1">P-R</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatVal(priceData.pR) }}</p>
            <p class="text-xs text-gray-400 mt-1">价格系数</p>
          </div>
          <div class="border border-gray-100 rounded-md p-4 bg-blue-50">
            <p class="text-xs text-gray-500 mb-1">备项目标价格</p>
            <p class="text-2xl font-bold text-blue-700">{{ formatVal(priceData.targetPrice) }}</p>
            <p class="text-xs text-gray-400 mt-1">建议采购价格</p>
          </div>
        </div>
        <!-- 华强网价格周/月变化 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div class="border border-gray-100 rounded-md p-3">
            <p class="text-sm text-gray-700 mb-2 text-center">华强网过去{{ hqStockPriceData.weekPriceArray.length || 'N' }}周价格变化</p>
            <div ref="chartHqPriceWeek" class="w-full h-48"></div>
          </div>
          <div class="border border-gray-100 rounded-md p-3">
            <p class="text-sm text-gray-700 mb-2 text-center">华强网过去{{ hqStockPriceData.monthPriceArray.length || 'N' }}个月价格变化</p>
            <div ref="chartHqPriceMonth" class="w-full h-48"></div>
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
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8001/api/data'
const route = useRoute()
const router = useRouter()

const loading = ref(true)
const material = ref(null)

// 华强网搜索指数(t_hq_peakfire: month_hot / weak_hot 的 int 数组及均值,无数据为空 → 前端显示 --)
const hqHotData = ref({ monthHotArray: [], monthHotAvg: null, weakHotArray: [], weakHotAvg: null, updateTime: null })

// 华强网库存/价格 周、月变化(t_hq_peakfire: week_stock / month_stock / week_price / month_price 数组)
const hqStockPriceData = ref({ weekStockArray: [], monthStockArray: [], weekPriceArray: [], monthPriceArray: [] })

// IC 月搜索量(t_ic_price_demand.month_search_count,无数据为 null → 前端显示 --)
const monthSearchCount = ref(null)

// Octopart 库存波动(t_octopart_info.stock_data 解析的每日点位 [{date, stock}],无数据为空 → 暂无数据)
const octopartStockData = ref([])

// 图表 DOM 引用
const chartHuaqiang1 = ref(null)
const chartHuaqiang2 = ref(null)
const chartSupplier = ref(null)
const chartOctopart = ref(null)
const chartHqStockWeek = ref(null)
const chartHqStockMonth = ref(null)
const chartHqPriceWeek = ref(null)
const chartHqPriceMonth = ref(null)

let chartInstances = []

const gradeStyles = {
  'A': 'bg-green-100 text-green-800',
  'B': 'bg-blue-100 text-blue-800',
  'C': 'bg-amber-100 text-amber-800',
  'D': 'bg-red-100 text-red-800'
}

const scoreProgressClass = computed(() => {
  const score = material.value?.score || 0
  if (score >= 90) return 'bg-green-500'   // A
  if (score >= 80) return 'bg-blue-500'     // B
  if (score >= 60) return 'bg-yellow-500'  // C
  return 'bg-red-500'                       // D
})

// 格式化日期为 YY-MM-DD(用于 X 轴标签,精确到日避免不清晰)
const fmtDate = (d) => {
  const yy = String(d.getFullYear()).slice(-2)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yy}-${mm}-${dd}`
}

// 按 update_time 生成 N 个月日期标签(末点 = update_time 所在月,逐月回退,取每月 1 号避免溢出)
const getMonthLabelsByUpdate = (n, updateTime) => {
  const labels = []
  const end = updateTime ? new Date(updateTime) : new Date()
  if (isNaN(end.getTime())) return Array(n).fill('--')
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(end.getFullYear(), end.getMonth() - i, 1)
    labels.push(fmtDate(d))
  }
  return labels
}

// 按 update_time 生成 N 周日期标签(末点 = update_time,逐周回退,7 天一步)
const getWeekLabelsByUpdate = (n, updateTime) => {
  const labels = []
  const end = updateTime ? new Date(updateTime) : new Date()
  if (isNaN(end.getTime())) return Array(n).fill('--')
  const MS_WEEK = 7 * 24 * 60 * 60 * 1000
  for (let i = n - 1; i >= 0; i--) {
    labels.push(fmtDate(new Date(end.getTime() - i * MS_WEEK)))
  }
  return labels
}

// 格式化数值:无值(null/空/0/NaN)显示 "--"(0 视为无数据,避免误导用户),数值加千分位,字符串原样返回
const formatVal = (v) => {
  if (v === null || v === undefined || v === '' || v === 0 || v === '0') return '--'
  if (typeof v === 'number') return isNaN(v) ? '--' : v.toLocaleString()
  return v
}

// 综合得分专用格式化:0 是合法得分(低分,非"无数据"),必须显示出来;仅 null/undefined/NaN 才显示 --
// (与 formatVal 区别:formatVal 把 0 当无数据 → --,但 score 的 0 是计算结果,不应被掩盖)
const formatScore = (v) => {
  if (v === null || v === undefined || v === '') return '--'
  if (typeof v === 'number') return isNaN(v) ? '--' : v.toLocaleString(undefined, { maximumFractionDigits: 2 })
  const n = Number(v)
  return isNaN(n) ? '--' : n.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

// 0/空 视为无数据 → 返回 null(供 computed 字段使用,统一交给 formatVal 显示 --)
const nonZeroOrNull = (v) => (v === null || v === undefined || v === '' || v === 0 || v === '0') ? null : v

// 需求信息数据(hA/hL 来自 t_hq_peakfire,wW 来自 t_ic_price_demand.month_search_count,wR 来自 t_ppn_result.wheat_ru)
const demandData = computed(() => {
  if (!material.value) return { hA: null, hL: null, wW: null, wR: null }
  return {
    hA: hqHotData.value.monthHotAvg,            // 华强月度搜索指数均值(t_hq_peakfire.month_hot 均值)
    hL: hqHotData.value.weakHotAvg,             // 华强周度搜索指数均值(t_hq_peakfire.weak_hot 均值)
    wW: nonZeroOrNull(monthSearchCount.value),   // IC月搜索量(t_ic_price_demand.month_search_count)
    wR: nonZeroOrNull(material.value.wheat_ru),  // 俄罗斯进口记录(0/空 → --)
  }
})

// 价格数据(从 t_ppn_result 真实字段,无对应字段为 null → 前端显示 --)
const priceData = computed(() => {
  if (!material.value) return { pB: null, pO: null, pR: null, targetPrice: null }
  return {
    pB: null,                          // 正能量价格(t_ppn_result 无对应)
    pO: material.value.oc_price,       // Octopart 参考价格
    pR: null,                          // 价格系数(无对应)
    targetPrice: null,                 // 备项目标价格(无对应)
  }
})

// 初始化折线图(按传入 labels 渲染,数据为空时不调用,改由 initEmptyChart 占位)
const initLineChart = (domRef, data, color, labels, tooltipName = '搜索指数') => {
  if (!domRef.value) return null
  const chart = echarts.init(domRef.value)
  chartInstances.push(chart)
  // 标签多时斜 45° 显示,避免日期拥挤看不全;同时加大底部留白
  const rotate = labels.length > 6 ? 45 : 0
  // 点位很多(如 Octopart 每日 ~380 点)时让 echarts 自动稀疏化(interval:'auto'),少则全显(interval:0)
  const interval = labels.length > 30 ? 'auto' : 0
  chart.setOption({
    grid: { left: 35, right: 10, top: 10, bottom: rotate ? 50 : 20 },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => `${labels[params[0].dataIndex]}: ${params[0].value.toLocaleString()}${tooltipName}`
    },
    xAxis: {
      type: 'category',
      data: labels,
      axisLabel: { color: '#9ca3af', fontSize: 10, rotate, interval },
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

// 初始化空图表(无时序数据时显示"暂无数据"占位)
const initEmptyChart = (domRef) => {
  if (!domRef.value) return null
  const chart = echarts.init(domRef.value)
  chartInstances.push(chart)
  chart.setOption({
    title: {
      text: '暂无数据',
      left: 'center',
      top: 'center',
      textStyle: { color: '#9ca3af', fontSize: 13, fontWeight: 'normal' }
    }
  })
  return chart
}

// 初始化供应商对比图(IC交易网 vs 华强网 供应商数量)
const initSupplierChart = (domRef, hqSup, icSup) => {
  if (!domRef.value) return null
  const chart = echarts.init(domRef.value)
  chartInstances.push(chart)
  // 0/空 视为无数据 → 柱高为 0,标签显示 "--"
  const has = (v) => v !== null && v !== undefined && v !== '' && v !== 0 && v !== '0'
  const raw = [icSup, hqSup]
  const labelText = (i) => has(raw[i]) ? Number(raw[i]).toLocaleString() : '--'
  chart.setOption({
    grid: { left: 40, right: 10, top: 30, bottom: 30 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params) => `${params[0].name}: ${labelText(params[0].dataIndex)}`
    },
    xAxis: {
      type: 'category',
      data: ['IC交易网', '华强网'],
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
      type: 'bar',
      data: [
        { value: has(icSup) ? Number(icSup) : 0, itemStyle: { color: '#3b82f6', borderRadius: [3, 3, 0, 0] } },
        { value: has(hqSup) ? Number(hqSup) : 0, itemStyle: { color: '#93c5fd', borderRadius: [3, 3, 0, 0] } }
      ],
      barWidth: 40,
      label: {
        show: true,
        position: 'top',
        color: '#6b7280',
        fontSize: 11,
        formatter: (params) => labelText(params.dataIndex)
      }
    }]
  })
  return chart
}

// 初始化所有图表
const initAllCharts = () => {
  chartInstances.forEach(c => c && !c.isDisposed() && c.dispose())
  chartInstances = []

  if (!material.value) return

  // 华强网过去12个月搜索指数: t_hq_peakfire.month_hot int 数组(无数据 → 暂无数据)
  const mArr = hqHotData.value.monthHotArray
  if (mArr.length) {
    initLineChart(chartHuaqiang1, mArr, '#3b82f6', getMonthLabelsByUpdate(mArr.length, hqHotData.value.updateTime), '月搜索指数')
  } else {
    initEmptyChart(chartHuaqiang1)
  }

  // 华强网过去N周搜索指数: t_hq_peakfire.weak_hot int 数组(无数据 → 暂无数据)
  const wArr = hqHotData.value.weakHotArray
  if (wArr.length) {
    initLineChart(chartHuaqiang2, wArr, '#93c5fd', getWeekLabelsByUpdate(wArr.length, hqHotData.value.updateTime), '周搜索指数')
  } else {
    initEmptyChart(chartHuaqiang2)
  }

  // IC交易网图表已隐藏(暂无法爬取到数据)

  // 供应商对比图:用真实 hq_sup_count / ic_sup_count
  initSupplierChart(chartSupplier, material.value.hq_sup_count, material.value.ic_sup_count)

  // Octopart 近一年库存波动: t_octopart_info.stock_data(每日 totalInventory,无数据 → 暂无数据)
  const oPts = octopartStockData.value
  if (oPts.length) {
    const oData = oPts.map(p => p.stock)
    const oLabels = oPts.map(p => {           // 日期精确到日,解析失败回退原串
      const dt = new Date(p.date)
      return isNaN(dt.getTime()) ? p.date : fmtDate(dt)
    })
    initLineChart(chartOctopart, oData, '#10b981', oLabels, '库存')
  } else {
    initEmptyChart(chartOctopart)
  }

  // 华强库存周/月变化: t_hq_peakfire.week_stock / month_stock int 数组(无数据 → 暂无数据)
  const upTime = hqHotData.value.updateTime
  const wkStock = hqStockPriceData.value.weekStockArray
  if (wkStock.length) {
    initLineChart(chartHqStockWeek, wkStock, '#8b5cf6', getWeekLabelsByUpdate(wkStock.length, upTime), '库存')
  } else {
    initEmptyChart(chartHqStockWeek)
  }
  const moStock = hqStockPriceData.value.monthStockArray
  if (moStock.length) {
    initLineChart(chartHqStockMonth, moStock, '#6366f1', getMonthLabelsByUpdate(moStock.length, upTime), '库存')
  } else {
    initEmptyChart(chartHqStockMonth)
  }

  // 华强价格周/月变化: t_hq_peakfire.week_price / month_price float 数组(无数据 → 暂无数据)
  const wkPrice = hqStockPriceData.value.weekPriceArray
  if (wkPrice.length) {
    initLineChart(chartHqPriceWeek, wkPrice, '#f59e0b', getWeekLabelsByUpdate(wkPrice.length, upTime), '价格')
  } else {
    initEmptyChart(chartHqPriceWeek)
  }
  const moPrice = hqStockPriceData.value.monthPriceArray
  if (moPrice.length) {
    initLineChart(chartHqPriceMonth, moPrice, '#ef4444', getMonthLabelsByUpdate(moPrice.length, upTime), '价格')
  } else {
    initEmptyChart(chartHqPriceMonth)
  }
}

// 加载型号详情数据(从 t_ppn_result 获取真实指标 + 综合得分 + 物料等级)
const fetchModelDetail = async () => {
  loading.value = true
  try {
    const model = decodeURIComponent(route.params.model)

    // 1. 从 t_ppn_result 查真实指标 + 综合得分 + 物料等级(含 task_name)
    let resultData = null
    try {
      const resp = await axios.get(`${API_BASE_URL}/ppn_result/detail`, {
        params: { ppn: model },
        timeout: 15000,
      })
      if (resp.data?.code === 200) {
        resultData = resp.data.data
      }
    } catch (e) {
      console.warn('查询 t_ppn_result 详情失败:', e)
    }

    // 2. resultData 已含全部关联数据(单次聚合查询合并 t_ppn_result + hq_peakfire + ic_price_demand
    //    + octopart_info + digikey_attr + t_ppn),直接分发到各图表/分类 ref,无需再发多次请求
    if (!resultData) {
      // 接口异常/无任何数据:重置图表 ref + 空数据页(全部 --)
      hqHotData.value = { monthHotArray: [], monthHotAvg: null, weakHotArray: [], weakHotAvg: null, updateTime: null }
      hqStockPriceData.value = { weekStockArray: [], monthStockArray: [], weekPriceArray: [], monthPriceArray: [] }
      monthSearchCount.value = null
      octopartStockData.value = []
      material.value = {
        model,
        brand: '', status: '',
        productCategory: '--', productSubCategory: '', series: '',
        updateDate: null, source: '',
        score: null, grade: null,
        hq_m_avg: null, hq_sup_count: null, hq_stock: null,
        ic_sup_count: null, ic_stock: null, efind_all_sup: null,
        wheat_global: null, wheat_ru: null,
        oc_price: null, oc_stock: null,
      }
    } else {
      // 华强月/周搜索指数(t_hq_peakfire)
      hqHotData.value = {
        monthHotArray: Array.isArray(resultData.month_hot_array) ? resultData.month_hot_array : [],
        monthHotAvg: resultData.month_hot_avg ?? null,
        weakHotArray: Array.isArray(resultData.weak_hot_array) ? resultData.weak_hot_array : [],
        weakHotAvg: resultData.weak_hot_avg ?? null,
        updateTime: resultData.hq_update_time ?? null,   // X 轴日期标签末点 = 该时间所在月/周
      }
      // IC 月搜索量(t_ic_price_demand)
      monthSearchCount.value = resultData.month_search_count ?? null
      // 华强库存/价格 周、月变化(t_hq_peakfire)
      hqStockPriceData.value = {
        weekStockArray: Array.isArray(resultData.week_stock_array) ? resultData.week_stock_array : [],
        monthStockArray: Array.isArray(resultData.month_stock_array) ? resultData.month_stock_array : [],
        weekPriceArray: Array.isArray(resultData.week_price_array) ? resultData.week_price_array : [],
        monthPriceArray: Array.isArray(resultData.month_price_array) ? resultData.month_price_array : [],
      }
      // Octopart 库存波动点位(t_octopart_info)
      octopartStockData.value = Array.isArray(resultData.stock_points) ? resultData.stock_points : []
      // 分类(t_digikey_attr.category 多行层级 → 分类/子分类/系列)
      const catParts = resultData.category
        ? String(resultData.category).split('\n').map(s => s.trim()).filter(Boolean)
        : []
      const catMain = catParts[0] || '--'                       // 主分类(无数据 → --)
      const catSub = catParts[1] || ''                          // 子分类
      const catSeries = catParts.slice(2).join(' / ') || ''     // 第 3 级及更细,合并展示

      // 构造 material 对象(全真实字段,无值字段为 null → formatVal 显示 --)
      material.value = {
        model,
        brand: resultData.manu_name || '',
        status: resultData.digikey_status || '',
        productCategory: catMain,
        productSubCategory: catSub,
        series: catSeries,
        updateDate: resultData.update_time,
        source: resultData.source || '',
        score: resultData.score,
        grade: resultData.grade,
        hq_m_avg: resultData.hq_m_avg,
        hq_sup_count: resultData.hq_sup_count,
        hq_stock: resultData.hq_stock,
        ic_sup_count: resultData.ic_sup_count,
        ic_stock: resultData.ic_stock,
        efind_all_sup: resultData.efind_all_sup,
        wheat_global: resultData.wheat_global,
        wheat_ru: resultData.wheat_ru,
        oc_price: resultData.oc_price,
        oc_stock: resultData.oc_stock,
      }
    }
  } catch (error) {
    console.error('获取型号详情失败:', error)
    material.value = null
  } finally {
    loading.value = false
  }

  // 数据就绪 + DOM 渲染后(loading=false 使 v-else 块挂载)再初始化图表
  if (material.value) {
    await nextTick()
    initAllCharts()
  }
}

// 返回:优先回到上一页,无历史时回分析查询
const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/analysis/query')
  }
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
