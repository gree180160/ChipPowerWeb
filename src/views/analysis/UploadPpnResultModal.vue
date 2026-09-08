<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black bg-opacity-50" @click="handleClose"></div>

    <div class="relative bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[92vh] overflow-hidden mx-4 flex flex-col">
      <!-- 标题栏 -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
        <h3 class="text-lg font-semibold text-gray-800 flex items-center">
          <i class="fa fa-file-excel text-green-600 mr-2"></i>
          导入 PPN 指标数据
          <span class="text-sm font-normal text-gray-500 ml-2">关联任务:{{ taskName }}</span>
        </h3>
        <button class="text-gray-400 hover:text-gray-600" @click="handleClose">
          <i class="fa fa-times text-xl"></i>
        </button>
      </div>

      <!-- 内容区 -->
      <div class="flex-1 overflow-y-auto px-6 py-5">
        <!-- Step 1: 文件选择 -->
        <div v-if="!preview" class="space-y-4">
          <div class="flex flex-col">
            <label class="text-sm text-gray-700 mb-2 text-left font-medium">
              <span class="text-red-500">*</span> 选择 Excel 文件
              <span class="text-gray-400 text-xs ml-1">需包含 ppn / HQ_hot_result / HQ_stock_sum / IC_stock_sum / efind_supplier / wheat_record / octopart 等 sheet</span>
            </label>
            <div
              class="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all"
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
                <i class="fa fa-cloud-upload-alt text-4xl text-gray-400"></i>
                <p class="text-sm text-gray-500 mt-3 font-medium">点击选择 Excel 文件(.xlsx / .xls)</p>
                <p class="text-xs text-gray-400 mt-1">文件将在后端解析,解析结果预览确认后才会写入数据库</p>
              </template>
              <template v-else>
                <div v-if="parsing" class="py-4">
                  <i class="fa fa-spinner fa-spin text-3xl text-blue-500"></i>
                  <p class="text-sm text-blue-600 mt-3 font-medium">正在解析 {{ excelFile.name }} ...</p>
                </div>
                <div v-else class="py-2">
                  <i class="fa fa-file-excel text-4xl text-green-500"></i>
                  <p class="text-sm text-green-700 mt-3 font-medium">{{ excelFile.name }}</p>
                  <p class="text-xs text-green-600 mt-1">{{ formatFileSize(excelFile.size) }}</p>
                  <button class="mt-3 text-xs text-red-500 hover:text-red-700 underline" @click.stop="clearFile">
                    <i class="fa fa-times mr-1"></i>重新选择
                  </button>
                </div>
              </template>
            </div>
            <span v-if="errorMsg" class="text-xs text-red-500 text-left mt-2">{{ errorMsg }}</span>
          </div>
        </div>

        <!-- Step 2: 预览 -->
        <div v-else class="space-y-4">
          <!-- 统计卡片 -->
          <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div class="bg-blue-50 rounded-lg p-3 text-center">
              <div class="text-2xl font-bold text-blue-600">{{ preview.total_count }}</div>
              <div class="text-xs text-gray-500 mt-1">PPN 总数</div>
            </div>
            <div class="bg-indigo-50 rounded-lg p-3 text-center">
              <div class="text-xl font-bold text-indigo-600">{{ preview.coverage.with_hq_m_avg }}</div>
              <div class="text-xs text-gray-500 mt-1">有 HQ_M_AV</div>
            </div>
            <div class="bg-emerald-50 rounded-lg p-3 text-center">
              <div class="text-xl font-bold text-emerald-600">{{ preview.coverage.with_hq_stock }}</div>
              <div class="text-xs text-gray-500 mt-1">有 HQ_STOCK</div>
            </div>
            <div class="bg-amber-50 rounded-lg p-3 text-center">
              <div class="text-xl font-bold text-amber-600">{{ preview.coverage.with_ic_stock }}</div>
              <div class="text-xs text-gray-500 mt-1">有 IC_STOCK</div>
            </div>
            <div class="bg-purple-50 rounded-lg p-3 text-center">
              <div class="text-xl font-bold text-purple-600">{{ preview.coverage.with_oc_price }}</div>
              <div class="text-xs text-gray-500 mt-1">有 OC_PRICE</div>
            </div>
          </div>

          <!-- 警告 -->
          <div v-if="preview.warnings && preview.warnings.length" class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div class="text-sm font-medium text-yellow-800 flex items-center mb-1">
              <i class="fa fa-exclamation-triangle mr-1"></i>解析警告
            </div>
            <ul class="text-xs text-yellow-700 list-disc list-inside space-y-0.5">
              <li v-for="(w, i) in preview.warnings" :key="i">{{ w }}</li>
            </ul>
          </div>

          <!-- 安全提示 -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div class="text-sm font-medium text-blue-800 flex items-center mb-1">
              <i class="fa fa-info-circle mr-1"></i>写入说明(UPSERT 模式)
            </div>
            <div class="text-xs text-blue-700 leading-relaxed">
              从 Excel 写入 {{ preview.total_count }} 条数据到 t_ppn_result 表<br>
              当 (ppn + manu_name + task_name) 完全一致时,新数据替换旧数据;其余旧记录保留
            </div>
          </div>

          <!-- 预览表格 -->
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <div class="bg-gray-50 px-4 py-2 flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700">
                数据预览
                <span class="text-gray-400 ml-1">(显示前 {{ preview.sample.length }} 条 / 共 {{ preview.total_count }} 条)</span>
              </span>
              <button class="text-xs text-gray-500 hover:text-gray-700" @click="backToSelect">
                <i class="fa fa-arrow-left mr-1"></i>重新选择文件
              </button>
            </div>
            <div class="max-h-64 overflow-y-auto">
              <table class="min-w-full divide-y divide-gray-200 text-xs">
                <thead class="bg-gray-100 sticky top-0">
                  <tr>
                    <th class="px-2 py-2 text-left font-medium text-gray-600 w-10">#</th>
                    <th class="px-2 py-2 text-left font-medium text-gray-600">ppn</th>
                    <th class="px-2 py-2 text-left font-medium text-gray-600">manu</th>
                    <th class="px-2 py-2 text-left font-medium text-gray-600">digikey</th>
                    <th class="px-2 py-2 text-left font-medium text-indigo-600">hq_m_avg</th>
                    <th class="px-2 py-2 text-left font-medium text-emerald-600">hq_sup</th>
                    <th class="px-2 py-2 text-left font-medium text-emerald-700">hq_stock</th>
                    <th class="px-2 py-2 text-left font-medium text-amber-600">ic_sup</th>
                    <th class="px-2 py-2 text-left font-medium text-amber-700">ic_stock</th>
                    <th class="px-2 py-2 text-left font-medium text-purple-600">oc_price</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                  <tr v-for="(row, idx) in preview.sample" :key="idx" class="hover:bg-gray-50">
                    <td class="px-2 py-1.5 text-gray-400">{{ idx + 1 }}</td>
                    <td class="px-2 py-1.5 font-mono font-medium text-gray-900" :title="row.ppn">{{ row.ppn }}</td>
                    <td class="px-2 py-1.5 text-gray-600 truncate" :title="row.manu_name">{{ row.manu_name || '-' }}</td>
                    <td class="px-2 py-1.5 text-gray-500 truncate" :title="row.digikey_status">{{ row.digikey_status || '-' }}</td>
                    <td class="px-2 py-1.5 font-mono" :class="getValClass(row.hq_m_avg)">{{ row.hq_m_avg || '-' }}</td>
                    <td class="px-2 py-1.5 font-mono" :class="getValClass(row.hq_sup_count)">{{ row.hq_sup_count || '-' }}</td>
                    <td class="px-2 py-1.5 font-mono" :class="getValClass(row.hq_stock)">{{ row.hq_stock || '-' }}</td>
                    <td class="px-2 py-1.5 font-mono" :class="getValClass(row.ic_sup_count)">{{ row.ic_sup_count || '-' }}</td>
                    <td class="px-2 py-1.5 font-mono" :class="getValClass(row.ic_stock)">{{ row.ic_stock || '-' }}</td>
                    <td class="px-2 py-1.5 font-mono" :class="getValClass(row.oc_price)">{{ row.oc_price || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="preview.total_count > preview.sample.length" class="bg-gray-50 px-4 py-1.5 text-center text-xs text-gray-500">
              ... 还有 {{ preview.total_count - preview.sample.length }} 条未显示
            </div>
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50 shrink-0">
        <button
          class="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100"
          :disabled="submitting"
          @click="handleClose"
        >
          取消
        </button>
        <button
          v-if="preview"
          class="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 flex items-center"
          :disabled="submitting || !preview.total_count"
          @click="confirmImport"
        >
          <i v-if="submitting" class="fa fa-spinner fa-spin mr-2"></i>
          <i v-else class="fa fa-check mr-2"></i>
          {{ submitting ? '写入中...' : `确认导入 ${preview.total_count} 条` }}
        </button>
        <button
          v-else
          class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center"
          :disabled="!excelFile || parsing"
          @click="parseFile"
        >
          <i v-if="parsing" class="fa fa-spinner fa-spin mr-2"></i>
          <i v-else class="fa fa-search mr-2"></i>
          {{ parsing ? '解析中...' : '解析预览' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import { useToast } from '@/composables/useToast'

const API_BASE_URL = 'http://localhost:8001/api/data'
const toast = useToast()

const props = defineProps({
  visible: { type: Boolean, default: false },
  taskName: { type: String, default: '' },
  existingCount: { type: Number, default: 0 },
})
const emit = defineEmits(['close', 'success'])

const fileInputRef = ref(null)
const excelFile = ref(null)
const parsing = ref(false)
const submitting = ref(false)
const errorMsg = ref('')
const preview = ref(null)

// 打开时重置状态
watch(() => props.visible, (v) => {
  if (v) {
    excelFile.value = null
    parsing.value = false
    submitting.value = false
    errorMsg.value = ''
    preview.value = null
  }
})

const triggerFileInput = () => fileInputRef.value?.click()

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1024 / 1024).toFixed(1) + ' MB'
}

const getValClass = (val) => {
  const n = Number(val)
  if (val && val !== '0' && !isNaN(n)) return 'text-blue-700 font-medium'
  return 'text-gray-400'
}

const clearFile = () => {
  excelFile.value = null
  preview.value = null
  errorMsg.value = ''
}

const handleFileChange = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  errorMsg.value = ''
  excelFile.value = file
  e.target.value = ''
}

const backToSelect = () => {
  preview.value = null
}

const parseFile = async () => {
  if (!excelFile.value) return
  if (!props.taskName) {
    toast.warning('任务名为空,请先保存任务')
    return
  }

  parsing.value = true
  errorMsg.value = ''
  try {
    const fd = new FormData()
    fd.append('file', excelFile.value)
    fd.append('task_name', props.taskName)
    fd.append('confirm', 'false')

    const resp = await axios.post(`${API_BASE_URL}/ppn_result/upload`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000,
    })

    if (resp.data?.code !== 200) {
      throw new Error(resp.data?.message || '解析失败')
    }
    preview.value = resp.data.data
  } catch (err) {
    errorMsg.value = err.response?.data?.message || err.message || '解析失败'
    excelFile.value = null
  } finally {
    parsing.value = false
  }
}

const confirmImport = async () => {
  if (!preview.value || !preview.value.total_count) return
  submitting.value = true
  try {
    const fd = new FormData()
    fd.append('file', excelFile.value)
    fd.append('task_name', props.taskName)
    fd.append('confirm', 'true')

    const resp = await axios.post(`${API_BASE_URL}/ppn_result/upload`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000,
    })

    if (resp.data?.code !== 200) {
      throw new Error(resp.data?.message || '导入失败')
    }

    const data = resp.data.data
    const parts = [`写入 ${data.written_count} 条`]
    if (data.warnings && data.warnings.length) {
      parts.push(`${data.warnings.length} 条警告`)
    }
    toast.success(`导入成功:${parts.join(', ')}`)
    emit('success', data)
  } catch (err) {
    const msg = err.response?.data?.message || err.message || '导入失败'
    toast.error(`导入失败:${msg}`)
  } finally {
    submitting.value = false
  }
}

const handleClose = () => {
  if (submitting.value) return
  emit('close')
}
</script>
