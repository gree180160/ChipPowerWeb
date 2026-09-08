<template>
  <!-- 新增任务弹框 -->
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- 遮罩 -->
    <div class="absolute inset-0 bg-black bg-opacity-50" @click="handleClose"></div>

    <!-- 弹框主体 -->
    <div class="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
      <!-- 标题栏 -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800">新增任务</h3>
        <button class="text-gray-400 hover:text-gray-600" @click="handleClose">
          <i class="fa fa-times text-xl"></i>
        </button>
      </div>

      <!-- 表单内容 -->
      <div class="px-6 py-5 space-y-5">
        <!-- 任务名称 -->
        <div class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1 text-left">
            <span class="text-red-500">*</span> 任务名称
          </label>
          <input
            v-model="form.taskName"
            type="text"
            placeholder="请输入任务名称"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-400': errors.taskName }"
          />
          <span v-if="errors.taskName" class="text-xs text-red-500 text-left mt-1">{{ errors.taskName }}</span>
        </div>

        <!-- 任务描述 -->
        <div class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1 text-left">任务描述</label>
          <textarea
            v-model="form.taskDesc"
            rows="3"
            placeholder="请输入任务描述(可选)"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          ></textarea>
        </div>

        <!-- 任务状态 + 优先级 -->
        <div class="grid grid-cols-2 gap-5">
          <!-- 任务状态 -->
          <div class="flex flex-col">
            <label class="text-sm text-gray-700 mb-1 text-left">任务状态</label>
            <select
              v-model="form.taskState"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="item in stateOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </option>
            </select>
          </div>

          <!-- 任务优先级 -->
          <div class="flex flex-col">
            <label class="text-sm text-gray-700 mb-1 text-left">任务优先级</label>
            <select
              v-model="form.taskLevel"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="item in levelOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- 任务类型 -->
        <div class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1 text-left">任务类型</label>
          <select
            v-model="form.taskKind"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="item in kindOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </option>
          </select>
        </div>

        <!-- Excel 上传 -->
        <div class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1 text-left">
            上传 Excel(关联 PPN)
            <span class="text-gray-400 text-xs ml-1">需包含名为 "ppn" 的 sheet,第一列 ppn,第二列 manu(支持有/无表头)</span>
          </label>
          <div
            class="border-2 border-dashed rounded-md p-5 text-center cursor-pointer transition-colors"
            :class="excelFile ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'"
            @click="triggerFileInput"
          >
            <input
              ref="fileInputRef"
              type="file"
              accept=".xlsx,.xls"
              class="hidden"
              @change="handleFileChange"
            />
            <template v-if="!excelFile">
              <i class="fa fa-cloud-upload-alt text-3xl text-gray-400"></i>
              <p class="text-sm text-gray-500 mt-2">点击选择 Excel 文件(.xlsx / .xls)</p>
            </template>
            <template v-else>
              <i class="fa fa-file-excel text-3xl text-green-500"></i>
              <p class="text-sm text-green-700 mt-2 font-medium">{{ excelFile.name }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ ppnRows.length }} 个型号已解析</p>
            </template>
          </div>
          <span v-if="errors.excelFile" class="text-xs text-red-500 text-left mt-1">{{ errors.excelFile }}</span>
        </div>

        <!-- 解析结果预览(显示前 20 条 + 总数) -->
        <div v-if="ppnRows.length" class="border border-gray-200 rounded-md overflow-hidden">
          <div class="bg-gray-50 px-4 py-2 flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700">
              PPN 预览
              <span class="text-blue-600 font-bold">共 {{ ppnRows.length }} 条</span>
              <span class="text-gray-400">(仅显示前 20 条)</span>
            </span>
            <button class="text-xs text-blue-600 hover:underline" @click="clearPpnRows">
              <i class="fa fa-times mr-1"></i>清空
            </button>
          </div>
          <div class="max-h-64 overflow-y-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50 sticky top-0">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 w-12">#</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">ppn (型号)</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">manu (品牌)</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(row, idx) in ppnRows.slice(0, 20)" :key="idx">
                  <td class="px-4 py-2 text-left text-xs text-gray-400">{{ idx + 1 }}</td>
                  <td class="px-4 py-2 text-left text-sm text-gray-900 font-mono">{{ row.ppn }}</td>
                  <td class="px-4 py-2 text-left text-sm text-gray-900">{{ row.manu_name }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="ppnRows.length > 20" class="bg-gray-50 px-4 py-2 text-center text-xs text-gray-500">
            ... 还有 {{ ppnRows.length - 20 }} 条未显示
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
        <button
          class="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100"
          @click="handleClose"
        >
          取消
        </button>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center"
          :disabled="submitting"
          @click="handleSubmit"
        >
          <i v-if="submitting" class="fa fa-spinner fa-spin mr-2"></i>
          <i v-else class="fa fa-check mr-2"></i>
          {{ submitting ? '提交中...' : '确定' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import * as XLSX from 'xlsx'
import axios from 'axios'
import { useToast } from '@/composables/useToast'

const toast = useToast()

import { API_BASE_URL } from '@/config'

const props = defineProps({
  visible: { type: Boolean, default: false },
  // 任务类型默认值:0分析任务 1监控任务
  defaultKind: { type: Number, default: 0 }
})
const emit = defineEmits(['close', 'success'])

// 表单数据
const form = reactive({
  taskName: '',
  taskDesc: '',
  taskState: 0,   // 默认待处理
  taskLevel: 1,    // 默认普通
  taskKind: props.defaultKind,
})

// 状态映射:0待处理 1进行中 2已完成 3已取消 4简化版完成
const stateOptions = [
  { value: 0, label: '待处理' },
  { value: 1, label: '进行中' },
  { value: 2, label: '已完成' },
  { value: 3, label: '已取消' },
  { value: 4, label: '简化版完成' },
]

// 优先级映射:1普通 2重要 3紧急
const levelOptions = [
  { value: 1, label: '普通' },
  { value: 2, label: '重要' },
  { value: 3, label: '紧急' },
]

// 任务类型映射:0分析任务 1监控任务
const kindOptions = [
  { value: 0, label: '分析任务' },
  { value: 1, label: '监控任务' },
]

// Excel 相关
const fileInputRef = ref(null)
const excelFile = ref(null)
const ppnRows = ref([])  // [{ ppn, manu_name }]
const errors = reactive({ taskName: '', excelFile: '' })
const submitting = ref(false)

// 触发文件选择
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

// 清空 PPN 列表
const clearPpnRows = () => {
  ppnRows.value = []
  excelFile.value = null
}

// 文件选择 -> 解析 Excel(按位置:col0=ppn,col1=manu)
const handleFileChange = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  errors.excelFile = ''
  excelFile.value = file
  ppnRows.value = []

  try {
    const data = await file.arrayBuffer()
    const workbook = XLSX.read(data, { type: 'array' })

    const sheetName = workbook.SheetNames.find(n => n.toLowerCase().trim() === 'ppn')
    if (!sheetName) {
      errors.excelFile = `未找到 "ppn" sheet,当前 sheets: ${workbook.SheetNames.join(', ')}`
      excelFile.value = null
      return
    }

    const sheet = workbook.Sheets[sheetName]
    // 按位置解析:header:1 返回二维数组,每行 [col0, col1, ...]
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' })

    if (!rows.length) {
      errors.excelFile = `"ppn" sheet 为空(没有数据行)`
      excelFile.value = null
      return
    }

    // 第一行可能是表头,跳过;后续每行 col0=ppn,col1=manu_name
    // 检查第一行是否是表头(ppn 列名一般是 ppn/型号/PartNumber)
    const firstRow = rows[0]
    const firstCol0 = String(firstRow[0] || '').trim().toLowerCase()
    const isHeader = ['ppn', '型号', 'partnumber', 'part_number', '产品型号'].includes(firstCol0)
    const dataRows = isHeader ? rows.slice(1) : rows

    const validRows = []
    for (const r of dataRows) {
      const ppn = String(r[0] || '').trim()
      const manu_name = String(r[1] || '').trim()
      if (!ppn) continue
      validRows.push({ ppn, manu_name })
    }

    if (!validRows.length) {
      errors.excelFile = `"ppn" sheet 中没有有效数据`
      return
    }

    ppnRows.value = validRows
  } catch (err) {
    errors.excelFile = `Excel 解析失败: ${err.message || err}`
    excelFile.value = null
  } finally {
    e.target.value = ''
  }
}

// 表单校验
const validate = () => {
  errors.taskName = ''
  errors.excelFile = ''
  let ok = true
  if (!form.taskName.trim()) {
    errors.taskName = '任务名称不能为空'
    ok = false
  }
  return ok
}

// 提交:先建任务,再批量上传 PPN
const handleSubmit = async () => {
  if (!validate()) return
  if (submitting.value) return
  submitting.value = true

  try {
    const taskName = form.taskName.trim()

    // 1. 调 task/write 建任务
    const taskPayload = [{
      Tname: taskName,
      Tdes: form.taskDesc.trim(),
      Tstate: form.taskState,
      Tlevel: form.taskLevel,
      tkind: form.taskKind,
    }]
    const taskResp = await axios.post(`${API_BASE_URL}/task/write`, taskPayload, { timeout: 30000 })
    if (taskResp.data?.code !== 200) {
      throw new Error(taskResp.data?.message || '任务创建失败')
    }

    // 2. 如果有 PPN,调 ppn/write 批量上传
    //    source = task name, manu_id = 0(待补), note = ''
    if (ppnRows.value.length) {
      const ppnPayload = ppnRows.value.map(r => ({
        ppn: r.ppn,
        manu_id: 0,
        manu_name: r.manu_name,
        source: taskName,
        note: '',
      }))
      const ppnResp = await axios.post(`${API_BASE_URL}/ppn/write`, ppnPayload, { timeout: 60000 })
      if (ppnResp.data?.code !== 200) {
        // 任务已建,但 PPN 上传失败,提示但不算完全失败
        toast.warning(`任务已创建,但 PPN 上传失败: ${ppnResp.data?.message}`)
      } else {
        toast.success(`任务创建成功! 关联 ${ppnPayload.length} 个 PPN`)
      }
    } else {
      // 明确告知:任务已建但未上传 PPN(避免误以为 PPN 也成功了)
      toast.info('任务已创建,但未上传 PPN(Excel 未解析到有效数据)')
    }

    // 重置 + 通知父组件刷新
    resetForm()
    emit('success')
  } catch (err) {
    const msg = err.response?.data?.message || err.message || '提交失败'
    toast.error(`新增任务失败: ${msg}`)
  } finally {
    submitting.value = false
  }
}

// 重置表单
const resetForm = () => {
  form.taskName = ''
  form.taskDesc = ''
  form.taskState = 0
  form.taskLevel = 1
  form.taskKind = props.defaultKind
  excelFile.value = null
  ppnRows.value = []
  errors.taskName = ''
  errors.excelFile = ''
}

// 关闭弹框
const handleClose = () => {
  if (submitting.value) return
  resetForm()
  emit('close')
}
</script>
