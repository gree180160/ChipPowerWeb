<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- 顶部:返回按钮 + 面包屑 -->
    <div class="flex items-center mb-6">
      <button
        @click="goBack"
        class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 mr-3"
      >
        <i class="fa fa-arrow-left mr-1.5"></i>返回
      </button>
      <h2 class="text-xl font-semibold text-gray-900">监控管理 > PPN 供应商库存详情</h2>
    </div>

    <!-- 加载中 -->
    <div v-if="loading" class="bg-white rounded-md shadow-sm p-12 text-center text-gray-500">
      <i class="fa fa-spinner fa-spin mr-2"></i>加载中...
    </div>

    <!-- 加载失败 -->
    <div v-else-if="error" class="bg-white rounded-md shadow-sm p-12 text-center text-gray-500">
      <i class="fa fa-exclamation-circle mr-2"></i>{{ error }}
    </div>

    <!-- 未找到数据 -->
    <div v-else-if="!detail || !detail.suppliers || !detail.suppliers.length" class="bg-white rounded-md shadow-sm p-12 text-center text-gray-500">
      <i class="fa fa-search-minus mr-2"></i>未找到该 PPN 的供应商库存数据
    </div>

    <template v-else>
      <!-- 型号信息卡片(吸顶悬浮:滚动到顶部后固定并加深阴影) -->
      <div
        class="bg-white rounded-md shadow-sm px-5 py-4 mb-6 sticky top-0 z-30 transition-shadow duration-200"
        :class="scrolled ? 'shadow-lg' : ''"
      >
        <div class="flex items-center flex-wrap gap-x-8 gap-y-2 text-left">
          <div class="text-sm leading-6">
            <span class="text-gray-500">PPN 型号: </span>
            <span class="font-semibold text-gray-900 font-mono">{{ detail.st_ppn }}</span>
          </div>
          <div class="text-sm leading-6">
            <span class="text-gray-500">品牌: </span>
            <span class="font-semibold text-gray-900">{{ detail.st_manu || '--' }}</span>
          </div>
          <div class="text-sm leading-6">
            <span class="text-gray-500">供应商数量: </span>
            <span class="font-semibold text-gray-900">{{ detail.suppliers.length }}</span>
          </div>
        </div>
        <!-- 图例说明 -->
        <div class="flex items-center flex-wrap gap-4 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
          <span class="inline-flex items-center gap-1.5"><i class="w-3 h-3 rounded-sm bg-emerald-500 inline-block"></i>较上一日期上升</span>
          <span class="inline-flex items-center gap-1.5"><i class="w-3 h-3 rounded-sm bg-red-500 inline-block"></i>较上一日期下降</span>
          <span class="inline-flex items-center gap-1.5"><i class="w-3 h-3 rounded-sm bg-gray-300 inline-block"></i>持平</span>
          <span class="inline-flex items-center gap-1.5"><i class="w-3 h-3 rounded-sm bg-blue-400 inline-block"></i>首条记录</span>
          <span class="inline-flex items-center gap-1.5">柱形为空的日期表示库存为非数值(如 --)</span>
          <span class="inline-flex items-center gap-1.5">相邻相同数量的日期合并为一根柱子</span>
        </div>
      </div>

      <!-- 每个供应商一张柱状图卡片,按最新库存从大到小排序 -->
      <div
        v-for="(sup, i) in detail.suppliers"
        :key="`${sup.supplier}-${i}`"
        class="bg-white rounded-md shadow-sm mb-4 overflow-hidden"
      >
        <!-- 供应商头部:序号 + 名称 + 最新库存 + 库存变化(左对齐) -->
        <div class="flex items-center flex-wrap gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <span class="shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center justify-center">{{ i + 1 }}</span>
          <i class="fa fa-building text-gray-400"></i>
          <span class="text-base font-semibold text-gray-900 truncate" :title="sup.supplier">{{ sup.supplier || '(未命名供应商)' }}</span>
          <div class="flex items-center gap-4 text-sm pl-3 border-l border-gray-200 ml-1">
            <div class="whitespace-nowrap">
              <span class="text-xs text-gray-400 mr-1">最新库存</span>
              <span class="font-mono font-semibold text-gray-900">{{ formatStock(sup.latest_stock) }}</span>
            </div>
            <div class="whitespace-nowrap">
              <span class="text-xs text-gray-400 mr-1">库存变化</span>
              <span class="font-mono font-bold" :class="stockChangeClass(sup.stock_change)">{{ formatStockChange(sup.stock_change) }}</span>
            </div>
          </div>
        </div>

        <!-- 柱状图: X轴=时间(连续同值日期合并), Y轴=库存数量,最多显示10组 -->
        <div :id="`sup-chart-${i}`" class="w-full" style="height: 240px;"></div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import * as echarts from 'echarts'

const API_BASE_URL = 'http://localhost:8001/api/data'

const route = useRoute()
const router = useRouter()

const ppn = (route.params.ppn || '').trim()
const loading = ref(true)
const error = ref('')
const detail = ref(null)
const scrolled = ref(false)

// 滚动时切换信息卡片的悬浮阴影
const onScroll = () => {
  scrolled.value = window.scrollY > 8
}

// 图表实例集合,用于统一销毁/缩放
const chartInstances = []

// 将库存值转为数字;非数值(如 "--")返回 null
const parseNum = (v) => {
  if (v === null || v === undefined) return null
  const s = String(v).trim().replace(/,/g, '')
  if (s === '') return null
  const n = Number(s)
  return isNaN(n) ? null : n
}

// 库存展示:空值显示 --
const formatStock = (v) => {
  if (v === null || v === undefined || v === '') return '--'
  return String(v)
}

// 库存变化展示:正数 +N(增),负数 -N(减),0 显示 0,无数据显示 --
const formatStockChange = (v) => {
  if (v === null || v === undefined) return '--'
  if (v > 0) return `+${v}`
  if (v < 0) return String(v)
  return '0'
}
const stockChangeClass = (v) => {
  if (v === null || v === undefined) return 'text-gray-400'
  if (v > 0) return 'text-emerald-600'
  if (v < 0) return 'text-red-600'
  return 'text-gray-500'
}

// 取某供应商在指定监控日期的库存值;该日期无记录或值为非数字时默认 0
const stockAtDate = (sup, date) => {
  if (!date) return 0
  const hit = (sup.history || []).find(h => h.m_date === date)
  if (!hit) return 0
  return parseNum(hit.sup_stock) ?? 0
}

// 按"当前型号最后一次监控日期"的库存从大到小排序;该日期无记录默认 0,不取其他日期库存参与排序
const sortSuppliers = (suppliers) => {
  let lastDate = null
  suppliers.forEach(s => {
    const hist = s.history || []
    if (hist.length) {
      const d = hist[hist.length - 1].m_date
      if (!lastDate || d > lastDate) lastDate = d
    }
  })
  return [...suppliers].sort((a, b) => {
    return stockAtDate(b, lastDate) - stockAtDate(a, lastDate)
  })
}

// 合并连续且数量相同的记录;最多保留最近 10 组
const buildChartData = (history) => {
  const groups = []
  history.forEach(h => {
    const v = parseNum(h.sup_stock)
    const last = groups[groups.length - 1]
    if (last && last.value === v) {
      last.end = h
      last.count++
    } else {
      groups.push({ start: h, end: h, value: v, count: 1 })
    }
  })
  return groups.slice(-10)
}

// 日期显示规则:当前年份只显示 MM.DD,其他年份显示年份后两位 YY.MM.DD
const CURRENT_YEAR = String(new Date().getFullYear())
const fmtDate = (d) => {
  const md = d.slice(5).replace(/-/g, '.') // MM.DD
  if (d.slice(0, 4) === CURRENT_YEAR) return md
  return `${d.slice(2, 4)}.${md}` // YY.MM.DD
}

// 生成 X 轴标签(按日期从小到大;非当前年份的日期显示年份后两位;区间用 " ~ " 分隔)
const buildAxisLabels = (groups) => {
  return groups.map(g => {
    const s = g.start.m_date
    const e = g.end.m_date
    if (g.count === 1) return fmtDate(s)
    return `${fmtDate(s)} ~ ${fmtDate(e)}`
  })
}

// 初始化每个供应商的柱状图
const initCharts = () => {
  if (!detail.value || !detail.value.suppliers) return
  try {
    detail.value.suppliers.forEach((sup, i) => {
      const el = document.getElementById(`sup-chart-${i}`)
      if (!el) return
      // 销毁已存在的实例
      const existing = echarts.getInstanceByDom(el)
      if (existing) existing.dispose()

      const chart = echarts.init(el)
      chartInstances.push(chart)

      const history = sup.history || []
      const groups = buildChartData(history)
      const dates = buildAxisLabels(groups)
      const values = groups.map(g => g.value)

      // 每根柱子按与上一组的变化着色:升绿/降红/平灰/首条蓝/空值浅灰
      const barColors = groups.map((g, idx) => {
        const v = g.value
        if (v === null) return 'rgba(148,163,184,0.35)'
        if (idx === 0) return '#60a5fa'
        const prev = groups[idx - 1].value
        if (prev === null) return '#60a5fa'
        if (v > prev) return '#10b981'
        if (v < prev) return '#ef4444'
        return '#cbd5e1'
      })

      chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: (params) => {
            const p = params[0]
            const idx = p.dataIndex
            const g = groups[idx]
            const v = g.value
            let dateStr = g.count === 1 ? fmtDate(g.start.m_date) : `${fmtDate(g.start.m_date)} ~ ${fmtDate(g.end.m_date)}`
            if (g.count > 1) dateStr += ` (${g.count} 个日期)`
            let lines = `<b>${dateStr}</b>`
            lines += `<br/>库存: <b>${v === null ? '--' : v}</b>`
            if (v !== null && idx > 0) {
              const prev = groups[idx - 1].value
              const diff = v - prev
              if (prev !== null && diff !== 0) {
                lines += `<br/>变化: <span style="color:${diff > 0 ? '#10b981' : '#ef4444'}">${diff > 0 ? '+' + diff : diff}</span>`
              }
            }
            const h = g.end
            if (h.sup_ppn) lines += `<br/>供应商型号: ${h.sup_ppn}`
            if (h.sup_manu) lines += `<br/>供应商品牌: ${h.sup_manu}`
            return lines
          }
        },
        grid: { left: 16, right: 24, top: 24, bottom: 8, containLabel: true },
        xAxis: {
          type: 'category',
          data: dates,
          axisLabel: {
            rotate: dates.length > 5 ? 45 : 0,
            fontSize: 11,
            color: '#6b7280',
            hideOverlap: true
          },
          axisLine: { lineStyle: { color: '#e5e7eb' } },
          axisTick: { show: false }
        },
        yAxis: {
          type: 'value',
          name: '数量',
          nameTextStyle: { fontSize: 11, color: '#9ca3af' },
          axisLabel: { fontSize: 11, color: '#6b7280' },
          splitLine: { lineStyle: { color: '#f3f4f6' } }
        },
        series: [{
          type: 'bar',
          data: values.map((v, idx) => ({ value: v, itemStyle: { color: barColors[idx] } })),
          barMaxWidth: 36,
          label: {
            show: true,
            position: 'top',
            fontSize: 10,
            color: '#374151',
            formatter: (p) => (p.value === null || p.value === undefined ? '' : String(p.value))
          },
          emphasis: {
            itemStyle: { shadowBlur: 6, shadowColor: 'rgba(0,0,0,0.2)' }
          }
        }]
      })
    })
  } catch (e) {
    console.error('[PPNMonitorDetail] 图表初始化失败:', e)
  }
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/monitor/task')
  }
}

const handleResize = () => {
  chartInstances.forEach(c => c.resize())
}

const fetchDetail = async () => {
  if (!ppn) {
    error.value = '缺少 PPN 参数'
    loading.value = false
    return
  }
  try {
    const resp = await axios.get(`${API_BASE_URL}/monitor_ic/supplier_stock`, {
      params: { st_ppn: ppn },
      timeout: 30000
    })
    const body = resp.data
    if (body && body.code === 200) {
      detail.value = body.data
      if (detail.value.suppliers) {
        detail.value.suppliers = sortSuppliers(detail.value.suppliers)
      }
    } else {
      error.value = (body && body.message) || '数据加载失败'
    }
  } catch (e) {
    error.value = e.response?.data?.message || e.message || '数据加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDetail()
  window.addEventListener('resize', handleResize)
  window.addEventListener('scroll', onScroll, { passive: true })
})

// 数据到位且 DOM 更新完成后初始化柱状图
watch(detail, () => {
  if (detail.value) {
    initCharts()
  }
}, { flush: 'post' })

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', onScroll)
  chartInstances.forEach(c => c.dispose())
  chartInstances.length = 0
})
</script>

<style scoped>
.overflow-x-auto { scrollbar-width: thin; scrollbar-color: #cbd5e0 #f7fafc; }
.overflow-x-auto::-webkit-scrollbar { height: 6px; }
.overflow-x-auto::-webkit-scrollbar-track { background: #f7fafc; }
</style>
