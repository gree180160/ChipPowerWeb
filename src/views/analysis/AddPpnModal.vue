<template>
  <!-- 新增 PPN 弹框 -->
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- 遮罩 -->
    <div class="absolute inset-0 bg-black bg-opacity-50" @click="handleClose"></div>

    <!-- 弹框主体 -->
    <div class="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
      <!-- 标题栏 -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800">
          新增 PPN
          <span class="text-sm font-normal text-gray-500 ml-2">关联任务:{{ taskName }}</span>
        </h3>
        <button class="text-gray-400 hover:text-gray-600" @click="handleClose">
          <i class="fa fa-times text-xl"></i>
        </button>
      </div>

      <!-- 表单内容 -->
      <div class="px-6 py-5 space-y-5">
        <!-- 输入方式切换 -->
        <div class="flex items-center space-x-4 border-b border-gray-200">
          <button
            class="px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors"
            :class="inputMode === 'textarea' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
            @click="inputMode = 'textarea'"
          >
            <i class="fa fa-keyboard mr-1"></i>文本粘贴
          </button>
          <button
            class="px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors"
            :class="inputMode === 'excel' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
            @click="inputMode = 'excel'"
          >
            <i class="fa fa-file-excel mr-1"></i>Excel 上传
          </button>
        </div>

        <!-- 文本粘贴模式 -->
        <div v-if="inputMode === 'textarea'" class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1 text-left">
            <span class="text-red-500">*</span> PPN 列表
            <span class="text-gray-400 text-xs ml-1">每行一条,格式:ppn,manu_name (品牌可空)</span>
          </label>
          <textarea
            v-model="ppnText"
            rows="8"
            placeholder="示例:&#10;STM32F103C8T6,STMicroelectronics&#10;ESP32-WROOM-32,Espressif&#10;TPS5430DDA,TI"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          ></textarea>
          <span v-if="errors.ppnText" class="text-xs text-red-500 text-left mt-1">{{ errors.ppnText }}</span>
        </div>

        <!-- Excel 上传模式 -->
        <div v-else class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1 text-left">
            上传 Excel
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
              <p class="text-xs text-gray-500 mt-1">{{ excelRows.length }} 个型号已解析</p>
            </template>
          </div>
          <span v-if="errors.excelFile" class="text-xs text-red-500 text-left mt-1">{{ errors.excelFile }}</span>
        </div>

        <!-- 备注 -->
        <div class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1 text-left">备注(可选,所有新增 PPN 共用)</label>
          <input
            v-model="note"
            type="text"
            placeholder="例如:批量补录"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- 解析预览 -->
        <div v-if="previewRows.length" class="border border-gray-200 rounded-md overflow-hidden">
          <div class="bg-gray-50 px-4 py-2 flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700">
              预览
              <span class="text-blue-600 font-bold">共 {{ previewRows.length }} 条</span>
              <span v-if="duplicateCount > 0" class="text-red-500 font-medium ml-2">
                (重复 {{ duplicateCount }} 条,可新增 {{ newCount }} 条)
              </span>
              <span class="text-gray-400 ml-1">(仅显示前 20 条)</span>
            </span>
            <button class="text-xs text-red-600 hover:underline" @click="clearPreview">
              <i class="fa fa-times mr-1"></i>清空
            </button>
          </div>
          <div class="max-h-48 overflow-y-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50 sticky top-0">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 w-12">#</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">ppn</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">manu_name</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 w-20">状态</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(row, idx) in previewRows.slice(0, 20)" :key="idx"
                  :class="isDuplicate(row) ? 'bg-red-50' : ''"
                >
                  <td class="px-4 py-2 text-left text-xs text-gray-400">{{ idx + 1 }}</td>
                  <td class="px-4 py-2 text-left text-sm font-mono"
                    :class="isDuplicate(row) ? 'text-red-400 line-through' : 'text-gray-900'"
                  >{{ row.ppn }}</td>
                  <td class="px-4 py-2 text-left text-sm"
                    :class="isDuplicate(row) ? 'text-red-400 line-through' : 'text-gray-900'"
                  >{{ row.manu_name || '-' }}</td>
                  <td class="px-4 py-2 text-left text-xs">
                    <span v-if="isDuplicate(row)" class="text-red-500">重复</span>
                    <span v-else class="text-green-600">新增</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="previewRows.length > 20" class="bg-gray-50 px-4 py-2 text-center text-xs text-gray-500">
            ... 还有 {{ previewRows.length - 20 }} 条未显示
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
          :disabled="submitting || !previewRows.length || newCount === 0"
          @click="handleSubmit"
        >
          <i v-if="submitting" class="fa fa-spinner fa-spin mr-2"></i>
          <i v-else class="fa fa-check mr-2"></i>
          {{ submitting ? '提交中...' : `确定新增 (${newCount})` }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import * as XLSX from 'xlsx'
import axios from 'axios'
import { useToast } from '@/composables/useToast'

const API_BASE_URL = 'http://localhost:8001/api/data'
const toast = useToast()

const props = defineProps({
  visible: { type: Boolean, default: false },
  // 关联任务名称(source 字段值)
  taskName: { type: String, default: '' }
})
const emit = defineEmits(['close', 'success'])

const inputMode = ref('textarea')  // textarea | excel
const ppnText = ref('')
const note = ref('')
const excelFile = ref(null)
const excelRows = ref([])  // [{ ppn, manu_name }]
const errors = reactive({ ppnText: '', excelFile: '' })
const submitting = ref(false)
const fileInputRef = ref(null)

// 当前任务已有 PPN 的去重集合,键 = "ppn|manu_name"(小写归一)
const existingKeys = ref(new Set())
const checkingExisting = ref(false)

// 构建 (ppn, manu_name) 的归一化键,统一小写+trim 避免大小写/空格差异漏判
const buildKey = (ppn, manu_name) => `${String(ppn||'').trim().toLowerCase()}|${String(manu_name||'').trim().toLowerCase()}`

// 拉取当前任务(source = taskName)已有的 PPN,构建去重集合
const fetchExistingPpns = async () => {
  existingKeys.value = new Set()
  if (!props.taskName) return
  checkingExisting.value = true
  try {
    const resp = await axios.get(`${API_BASE_URL}/ppn/read`, {
      params: { filter_contend: `source = "${props.taskName}"` },
      timeout: 30000,
    })
    if (resp.data?.code === 200) {
      const rows = resp.data.data || []
      const set = new Set()
      // 返回字段顺序: ppn, manu_id, manu_name, source, note, upload_date
      for (const r of rows) {
        set.add(buildKey(r[0], r[2]))
      }
      existingKeys.value = set
    }
  } catch (e) {
    console.warn('拉取已有 PPN 失败,跳过去重检查:', e)
  } finally {
    checkingExisting.value = false
  }
}

// 判断单条是否与库中重复
const isDuplicate = (row) => existingKeys.value.has(buildKey(row.ppn, row.manu_name))

// 弹框打开时重置 + 拉取已有 PPN
watch(() => props.visible, (v) => {
  if (v) {
    inputMode.value = 'textarea'
    ppnText.value = ''
    note.value = ''
    excelFile.value = null
    excelRows.value = []
    errors.ppnText = ''
    errors.excelFile = ''
    submitting.value = false
    // 拉取当前任务已有 PPN,用于去重
    fetchExistingPpns()
  }
})

// 预览数据(根据输入模式动态计算)
const previewRows = computed(() => {
  if (inputMode.value === 'excel') return excelRows.value
  // 解析文本: 每行一条,格式 ppn,manu_name
  const lines = ppnText.value.split('\n').map(l => l.trim()).filter(Boolean)
  const rows = []
  for (const line of lines) {
    const parts = line.split(',').map(s => s.trim())
    const ppn = parts[0]
    if (!ppn) continue
    rows.push({ ppn, manu_name: parts[1] || '' })
  }
  return rows
})

// 重复条目数(与库中已有记录重复)
const duplicateCount = computed(() => previewRows.value.filter(isDuplicate).length)
// 可新增条目数(去重后)
const newCount = computed(() => previewRows.value.length - duplicateCount.value)

const triggerFileInput = () => fileInputRef.value?.click()

const clearPreview = () => {
  if (inputMode.value === 'excel') {
    excelFile.value = null
    excelRows.value = []
  } else {
    ppnText.value = ''
  }
}

// Excel 文件解析(按位置:col0=ppn,col1=manu_name)
const handleFileChange = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  errors.excelFile = ''
  excelFile.value = file
  excelRows.value = []

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
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' })
    if (!rows.length) {
      errors.excelFile = `"ppn" sheet 为空`
      excelFile.value = null
      return
    }

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
    excelRows.value = validRows
  } catch (err) {
    errors.excelFile = `Excel 解析失败: ${err.message || err}`
    excelFile.value = null
  } finally {
    e.target.value = ''
  }
}

// 提交:过滤掉与库中重复的条目,只批量上传新增的,source = taskName
const handleSubmit = async () => {
  const rows = previewRows.value
  if (!rows.length) {
    errors.ppnText = '请输入至少一条 PPN'
    return
  }
  if (!props.taskName) {
    toast.warning('任务名称为空,无法关联 PPN')
    return
  }
  if (submitting.value) return

  // 过滤掉与库中已有记录重复的条目(ppn + manu_name + source 组合)
  // 同时对批次内重复去重(同一批输入里出现多次的只保留一条)
  const seenInBatch = new Set()
  const newRows = []
  let dupWithDb = 0
  let dupInBatch = 0
  for (const r of rows) {
    const key = buildKey(r.ppn, r.manu_name)
    if (isDuplicate(r)) { dupWithDb++; continue }
    if (seenInBatch.has(key)) { dupInBatch++; continue }
    seenInBatch.add(key)
    newRows.push(r)
  }
  const skipped = dupWithDb + dupInBatch
  if (!newRows.length) {
    toast.warning(`全部 ${rows.length} 条与已有记录重复,无需新增`)
    return
  }

  submitting.value = true
  try {
    const payload = newRows.map(r => ({
      ppn: r.ppn,
      manu_id: 0,
      manu_name: r.manu_name,
      source: props.taskName,
      note: note.value.trim(),
    }))
    const resp = await axios.post(`${API_BASE_URL}/ppn/write`, payload, { timeout: 60000 })
    if (resp.data?.code !== 200) {
      throw new Error(resp.data?.message || 'PPN 上传失败')
    }
    // 区分提示:有跳过时附带说明
    if (skipped > 0) {
      const parts = []
      if (dupWithDb) parts.push(`库内重复 ${dupWithDb}`)
      if (dupInBatch) parts.push(`批次内重复 ${dupInBatch}`)
      toast.success(`成功新增 ${payload.length} 条 PPN(已跳过 ${parts.join('、')})`)
    } else {
      toast.success(`成功新增 ${payload.length} 条 PPN`)
    }
    emit('success')
  } catch (err) {
    const msg = err.response?.data?.message || err.message || '提交失败'
    toast.error(`新增 PPN 失败: ${msg}`)
  } finally {
    submitting.value = false
  }
}

const handleClose = () => {
  if (submitting.value) return
  emit('close')
}
</script>
