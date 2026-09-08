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
      <h2 class="text-xl font-semibold text-gray-900">{{ breadcrumbTitle }}</h2>
    </div>

    <!-- 任务信息卡片(可编辑名称/描述/状态/优先级) -->
    <div class="bg-white rounded-md shadow-sm p-5 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <i class="fa fa-tasks text-blue-600 mr-2"></i>任务信息
        </h3>
        <div class="flex items-center space-x-2">
          <!-- 显示模式:编辑按钮 -->
          <button
            v-if="!editing"
            class="px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center"
            @click="enterEdit"
          >
            <i class="fa fa-edit mr-1.5"></i>编辑
          </button>
          <!-- 编辑模式:取消 + 保存按钮 -->
          <template v-else>
            <button
              class="px-4 py-1.5 border border-gray-300 rounded-md text-sm flex items-center"
              :class="saving
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'"
              :disabled="saving"
              @click="cancelEdit"
            >
              <i class="fa fa-times mr-1.5"></i>取消
            </button>
            <button
              class="px-4 py-1.5 rounded-md text-sm flex items-center"
              :class="saving
                ? 'bg-green-400 text-white cursor-wait'
                : 'bg-green-600 text-white hover:bg-green-700'"
              :disabled="saving"
              @click="saveTask"
            >
              <svg v-if="saving" class="animate-spin mr-1.5 w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <i v-else class="fa fa-check mr-1.5"></i>
              {{ saving ? '保存中...' : '保存' }}
            </button>
          </template>
        </div>
      </div>

      <!-- 加载中 -->
      <div v-if="loading" class="py-8 text-center text-gray-500">
        <i class="fa fa-spinner fa-spin mr-2"></i>加载中...
      </div>

      <!-- 任务表单:label 与 input 同行,降低整体高度 -->
      <div v-else-if="task" class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3">
        <!-- 任务名称(可编辑) -->
        <div class="flex items-center">
          <label class="text-sm text-gray-700 text-left whitespace-nowrap w-24 shrink-0">
            <span class="text-red-500">*</span> 任务名称
          </label>
          <input
            v-model="form.taskName"
            type="text"
            :disabled="!editing"
            class="px-3 py-2 border rounded-md text-sm flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-400"
            :class="editing
              ? 'border-blue-400 bg-white text-gray-900'
              : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'"
          />
        </div>

        <!-- 任务编号(始终只读) -->
        <div class="flex items-center">
          <label class="text-sm text-gray-700 text-left whitespace-nowrap w-24 shrink-0">任务编号</label>
          <input
            :value="task.taskId"
            type="text"
            disabled
            class="px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-sm flex-1 min-w-0 cursor-not-allowed text-gray-500"
          />
        </div>

        <!-- 任务状态(可编辑) -->
        <div class="flex items-center">
          <label class="text-sm text-gray-700 text-left whitespace-nowrap w-24 shrink-0">任务状态</label>
          <select
            v-model="form.Tstate"
            :disabled="!editing"
            class="px-3 py-2 border rounded-md text-sm flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-400"
            :class="editing
              ? 'border-blue-400 bg-white text-gray-900'
              : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'"
          >
            <option v-for="item in stateOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </option>
          </select>
        </div>

        <!-- 任务优先级(可编辑) -->
        <div class="flex items-center">
          <label class="text-sm text-gray-700 text-left whitespace-nowrap w-24 shrink-0">任务优先级</label>
          <select
            v-model="form.Tlevel"
            :disabled="!editing"
            class="px-3 py-2 border rounded-md text-sm flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-400"
            :class="editing
              ? 'border-blue-400 bg-white text-gray-900'
              : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'"
          >
            <option v-for="item in levelOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </option>
          </select>
        </div>

        <!-- 上传日期(可编辑) -->
        <div class="flex items-center">
          <label class="text-sm text-gray-700 text-left whitespace-nowrap w-24 shrink-0">上传日期</label>
          <input
            v-model="form.uploadDate"
            type="date"
            :disabled="!editing"
            class="px-3 py-2 border rounded-md text-sm flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-400"
            :class="editing
              ? 'border-blue-400 bg-white text-gray-900'
              : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'"
          />
        </div>

        <!-- 结束日期(可编辑) -->
        <div class="flex items-center">
          <label class="text-sm text-gray-700 text-left whitespace-nowrap w-24 shrink-0">结束日期</label>
          <input
            v-model="form.endDate"
            type="date"
            :disabled="!editing"
            class="px-3 py-2 border rounded-md text-sm flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-400"
            :class="editing
              ? 'border-blue-400 bg-white text-gray-900'
              : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'"
          />
        </div>

        <!-- 任务描述(可编辑) - 放最后一行,单行 input,高度与其他一致 -->
        <div class="flex items-center md:col-span-2">
          <label class="text-sm text-gray-700 text-left whitespace-nowrap w-24 shrink-0">任务描述</label>
          <input
            v-model="form.taskDesc"
            type="text"
            :disabled="!editing"
            class="px-3 py-2 border rounded-md text-sm flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-400"
            :class="editing
              ? 'border-blue-400 bg-white text-gray-900'
              : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'"
            placeholder="请输入任务描述"
          />
        </div>
      </div>

      <!-- 未找到任务 -->
      <div v-else class="py-8 text-center text-gray-500">
        <i class="fa fa-exclamation-circle mr-2"></i>未找到任务数据
      </div>

      <!-- HQ 筛选(默认极值=灰=不筛;拨动离开极值=高亮;点"搜索"才把条件加入请求) 仅已完成/简化版完成 任务显示指标筛选 -->
      <div v-if="task && isResultBased" class="mt-4 pt-4 border-t border-gray-200 flex items-center gap-6 flex-wrap">
        <!-- HQ_M_AV 筛选 范围 [50, 800] -->
        <div class="flex items-center gap-2">
          <span class="text-sm whitespace-nowrap" :class="mavActive ? 'text-blue-600 font-semibold' : 'text-gray-400'">HQ_M_AV ≥</span>
          <span class="text-[10px] text-gray-400">50</span>
          <input type="range" min="50" max="800" step="10" v-model.number="hqMavMin" class="w-32 accent-blue-600 cursor-pointer" :class="{ 'opacity-40': !mavActive }" />
          <span class="text-[10px] text-gray-400">800</span>
          <span class="text-sm font-bold w-10 text-right" :class="mavActive ? 'text-blue-600' : 'text-gray-400'">{{ hqMavMin }}</span>
        </div>
        <!-- HQ_SUP 筛选 范围 [2, 50] -->
        <div class="flex items-center gap-2">
          <span class="text-sm whitespace-nowrap" :class="supActive ? 'text-emerald-600 font-semibold' : 'text-gray-400'">HQ_SUP ≤</span>
          <span class="text-[10px] text-gray-400">2</span>
          <input type="range" min="2" max="20" step="1" v-model.number="hqSupMax" class="w-32 accent-emerald-600 cursor-pointer" :class="{ 'opacity-40': !supActive }" />
          <span class="text-[10px] text-gray-400">20</span>
          <span class="text-sm font-bold w-10 text-right" :class="supActive ? 'text-emerald-600' : 'text-gray-400'">{{ hqSupMax }}</span>
        </div>
        <!-- IC_SUP 筛选 范围 [2, 20] -->
        <div class="flex items-center gap-2">
          <span class="text-sm whitespace-nowrap" :class="icSupActive ? 'text-amber-600 font-semibold' : 'text-gray-400'">IC_SUP ≤</span>
          <span class="text-[10px] text-gray-400">2</span>
          <input type="range" min="2" max="20" step="1" v-model.number="icSupMax" class="w-32 accent-amber-600 cursor-pointer" :class="{ 'opacity-40': !icSupActive }" />
          <span class="text-[10px] text-gray-400">20</span>
          <span class="text-sm font-bold w-10 text-right" :class="icSupActive ? 'text-amber-600' : 'text-gray-400'">{{ icSupMax }}</span>
        </div>
        <div class="flex items-center gap-2">
          <button class="px-3 py-1.5 bg-white border border-gray-300 text-gray-600 rounded-md text-sm hover:bg-gray-50" @click="resetFilter">重置</button>
          <button class="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center" @click="onFilterChange">
            <i class="fa fa-search mr-1"></i>搜索
          </button>
        </div>
      </div>
    </div>

    <!-- 关联 PPN 列表 -->
    <div v-if="task" class="bg-white rounded-md shadow-sm overflow-hidden">
      <!-- PPN 列表头部 -->
      <div class="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <i class="fa fa-microchip text-blue-600 mr-2"></i>关联 PPN 列表
          <span class="ml-2 text-sm font-normal text-gray-500">
            共 <span class="text-blue-600 font-bold">{{ ppnTotal }}</span> 个
          </span>
        </h3>
        <div class="flex items-center space-x-2">
          <button
            class="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center"
            @click="showAddPpnModal = true"
          >
            <i class="fa fa-plus mr-1.5"></i>新增 PPN
          </button>
          <button
            class="px-3 py-1.5 bg-white border border-green-400 text-green-700 rounded-md text-sm hover:bg-green-50 flex items-center"
            @click="showUploadModal = true"
          >
            <i class="fa fa-upload mr-1.5"></i>导入指标
          </button>
          <button
            class="px-3 py-1.5 bg-white border border-red-300 text-red-700 rounded-md text-sm hover:bg-red-50 flex items-center"
            :disabled="!selectedPpns.length"
            @click="batchDeletePpn"
          >
            <i class="fa fa-trash mr-1.5"></i>批量删除
            <span v-if="selectedPpns.length" class="ml-1">({{ selectedPpns.length }})</span>
          </button>
          <button
            class="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50 flex items-center"
            @click="downloadPpnCsv"
          >
            <i class="fa fa-download mr-1.5"></i>下载 CSV
          </button>
        </div>
      </div>

      <!-- PPN 表格(用 local 遮罩覆盖加载状态,min-h 确保 loading 时遮罩有足够空间) -->
      <div class="overflow-x-auto relative min-h-[480px]">
        <!-- 加载遮罩:覆盖表格区域,使用 PageLoading 组件 -->
        <PageLoading
          :visible="ppnLoading"
          scope="local"
          text="正在加载 PPN..."
          size="sm"
        />
        <!-- table-fixed + colgroup:固定列宽,确保 th 与 td 严格对齐 -->
        <table class="min-w-full divide-y divide-gray-200 table-fixed">
          <colgroup>
            <col class="w-12" />   <!-- 复选框 -->
            <col class="w-12" />   <!-- 收藏 -->
            <col class="w-56" />   <!-- PPN -->
            <col class="w-40" />   <!-- 品牌 -->
            <col class="w-28" />   <!-- HQ_M_AV -->
            <col class="w-28" />   <!-- HQ_SUP -->
            <col class="w-32" />   <!-- 上传日期 -->
            <col class="w-24" />   <!-- 操作 -->
          </colgroup>
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                <input
                  type="checkbox"
                  :checked="allSelected"
                  :indeterminate.prop="someSelected"
                  @change="toggleSelectAll"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">收藏</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">PPN</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">品牌</th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap cursor-pointer select-none hover:bg-gray-100" @click="toggleSort('hq_m_avg')">
                <span class="flex items-center gap-1" :class="sortField === 'hq_m_avg' ? 'text-blue-600' : 'text-gray-500'">
                  HQ_M_AV
                  <i class="fa fa-sort text-xs" :class="getSortIconClass('hq_m_avg')"></i>
                </span>
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap cursor-pointer select-none hover:bg-gray-100" @click="toggleSort('hq_sup_count')">
                <span class="flex items-center gap-1" :class="sortField === 'hq_sup_count' ? 'text-emerald-600' : 'text-gray-500'">
                  HQ_SUP
                  <i class="fa fa-sort text-xs" :class="getSortIconClass('hq_sup_count')"></i>
                </span>
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap cursor-pointer select-none hover:bg-gray-100" @click="toggleSort('hq_stock')">
                <span class="flex items-center gap-1" :class="sortField === 'hq_stock' ? 'text-emerald-700' : 'text-gray-500'">
                  HQ_STOCK
                  <i class="fa fa-sort text-xs" :class="getSortIconClass('hq_stock')"></i>
                </span>
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap cursor-pointer select-none hover:bg-gray-100" @click="toggleSort('ic_sup_count')">
                <span class="flex items-center gap-1" :class="sortField === 'ic_sup_count' ? 'text-amber-600' : 'text-gray-500'">
                  IC_SUP
                  <i class="fa fa-sort text-xs" :class="getSortIconClass('ic_sup_count')"></i>
                </span>
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap cursor-pointer select-none hover:bg-gray-100" @click="toggleSort('ic_stock')">
                <span class="flex items-center gap-1" :class="sortField === 'ic_stock' ? 'text-amber-700' : 'text-gray-500'">
                  IC_STOCK
                  <i class="fa fa-sort text-xs" :class="getSortIconClass('ic_stock')"></i>
                </span>
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="!ppnLoading && !pagedPpns.length">
              <td colspan="10" class="px-4 py-8 text-center text-gray-500">
                <i class="fa fa-search-minus mr-2"></i>暂无关联 PPN,可点击右上角"新增 PPN"添加
              </td>
            </tr>
            <template v-else-if="!ppnLoading">
            <tr v-for="(item, idx) in pagedPpns" :key="`${item.ppn}-${item.manu_name}`" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  :checked="isSelected(item)"
                  @change="toggleSelect(item)"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td class="px-4 py-3 text-left">
                <!-- 仅 t_ppn_result(已完成/简化版完成) 支持收藏 -->
                <button
                  v-if="item.fromResult && item.id"
                  class="inline-flex items-center justify-center w-7 h-7 rounded-md focus:outline-none focus:ring-0 transition-colors duration-150"
                  :class="isCollected(item.id)
                    ? 'text-amber-500 bg-amber-50'
                    : 'text-gray-300 hover:text-gray-400'"
                  :title="isCollected(item.id) ? '点击取消收藏' : (isLoggedIn() ? '点击收藏' : '登录后可收藏')"
                  @click="toggleFavorite(item)"
                >
                  <i :class="isCollected(item.id) ? 'fa fa-star' : 'fa-regular fa-star'" style="font-size: 1.2rem"></i>
                </button>
              </td>
              <td class="px-4 py-3 text-sm text-left font-mono truncate" :title="item.ppn">
                <a
                  class="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  @click="goToPpnDetail(item.ppn)"
                >{{ item.ppn }}</a>
              </td>
              <td class="px-4 py-3 text-sm text-gray-600 text-left truncate" :title="item.manu_name">{{ item.manu_name || '-' }}</td>
              <td class="px-4 py-3 text-sm text-left font-mono" :class="item.hq_m_avg > 0 ? 'text-indigo-600 font-medium' : 'text-gray-400'">{{ item.hq_m_avg > 0 ? item.hq_m_avg : '-' }}</td>
              <td class="px-4 py-3 text-sm text-left font-mono" :class="item.hq_sup_count > 0 ? 'text-emerald-600 font-medium' : 'text-gray-400'">{{ item.hq_sup_count > 0 ? item.hq_sup_count : '-' }}</td>
              <td class="px-4 py-3 text-sm text-left font-mono" :class="item.hq_stock > 0 ? 'text-emerald-700 font-medium' : 'text-gray-400'">{{ item.hq_stock > 0 ? item.hq_stock : '-' }}</td>
              <td class="px-4 py-3 text-sm text-left font-mono" :class="item.ic_sup_count > 0 ? 'text-amber-600 font-medium' : 'text-gray-400'">{{ item.ic_sup_count > 0 ? item.ic_sup_count : '-' }}</td>
              <td class="px-4 py-3 text-sm text-left font-mono" :class="item.ic_stock > 0 ? 'text-amber-700 font-medium' : 'text-gray-400'">{{ item.ic_stock > 0 ? item.ic_stock : '-' }}</td>
              <td class="px-4 py-3 text-sm font-medium text-left">
                <button
                  class="text-red-600 hover:text-red-900"
                  @click="deletePpn(item)"
                >
                  <i class="fa fa-trash mr-1"></i>删除
                </button>
              </td>
            </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- 分页控件(后端分页,切页会重新请求) -->
      <div v-if="ppnTotal > 0" class="flex items-center justify-between px-5 py-3 border-t border-gray-200">
        <div class="text-sm text-gray-500">
          显示 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, ppnTotal) }} 条,共 {{ ppnTotal }} 条 · 每页 {{ pageSize }} 条
        </div>
        <div class="flex items-center space-x-1">
          <!-- 首页 -->
          <button
            class="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="currentPage === 1"
            @click="goToPage(1)"
          >首页</button>
          <!-- 上一页 -->
          <button
            class="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            <i class="fa fa-chevron-left text-xs"></i>
          </button>
          <!-- 页码 -->
          <button
            v-for="page in pageRange"
            :key="page"
            class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:cursor-not-allowed"
            :class="currentPage === page ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'"
            :disabled="currentPage === page"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
          <!-- 下一页 -->
          <button
            class="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            <i class="fa fa-chevron-right text-xs"></i>
          </button>
          <!-- 尾页 -->
          <button
            class="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="currentPage === totalPages"
            @click="goToPage(totalPages)"
          >尾页</button>
        </div>
      </div>
    </div>

    <!-- 新增 PPN 弹框 -->
    <AddPpnModal
      :visible="showAddPpnModal"
      :task-name="task ? task.taskName : ''"
      @close="showAddPpnModal = false"
      @success="onPpnAdded"
    />

    <!-- 导入指标弹框 -->
    <UploadPpnResultModal
      :visible="showUploadModal"
      :task-name="task ? task.taskName : ''"
      :existing-count="ppnTotal"
      @close="showUploadModal = false"
      @success="onUploadSuccess"
    />

    <!-- 登录弹窗(未登录点击收藏时触发) -->
    <LoginModal
      :visible="showLoginModal"
      @close="showLoginModal = false"
      @success="onLoginSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import AddPpnModal from './AddPpnModal.vue'
import UploadPpnResultModal from './UploadPpnResultModal.vue'
import LoginModal from '@/components/LoginModal.vue'
import PageLoading from '@/components/PageLoading.vue'
import { useToast } from '@/composables/useToast'

const API_BASE_URL = 'http://localhost:8001/api/data'
const route = useRoute()
const router = useRouter()
const toast = useToast()

// 分析任务详情页(与监控任务详情页拆分,便于差异化定制)
const breadcrumbTitle = '分析管理 > 任务详情'

// 任务数据
const loading = ref(true)
const task = ref(null)  // { taskId, taskName, taskDesc, Tstate, Tlevel, tkind, uploadDate, endDate }
const editing = ref(false)
const saving = ref(false)

// 编辑表单(进入编辑时初始化)
const form = ref({
  taskName: '',
  taskDesc: '',
  Tstate: 0,
  Tlevel: 1,
  uploadDate: '',
  endDate: '',
})

// 状态/优先级选项
const stateOptions = [
  { value: 0, label: '待处理' },
  { value: 1, label: '进行中' },
  { value: 2, label: '已完成' },
  { value: 3, label: '已取消' },
  { value: 4, label: '简化版完成' },
]
const levelOptions = [
  { value: 1, label: '普通' },
  { value: 2, label: '重要' },
  { value: 3, label: '紧急' },
]

// ==================== PPN 列表 ====================
const ppnList = ref([])  // [{ ppn, manu_id, manu_name, source, note, upload_date, hq_m_av, hq_sup }]
const ppnLoading = ref(false)
const ppnTotal = ref(0)  // 总记录数(由后端返回)
const selectedPpns = ref([])  // 选中的 PPN(用于批量删除)

// PPN 数据来源:已完成/简化版完成(2/4) 从 t_ppn_result(with_hq) 取;其他状态从 t_ppn 取
const ppnSrc = ref('result')  // 'result' => t_ppn_result, 'ppn' => t_ppn
// 任务是否已完成(2 已完成 / 4 简化版完成)→ 决定 PPN 数据来源与是否显示指标筛选
const isResultBased = computed(() =>
  task.value && (task.value.Tstate === 2 || task.value.Tstate === 4)
)

const showAddPpnModal = ref(false)
const showUploadModal = ref(false)
const showLoginModal = ref(false)  // 登录弹窗(未登录点击收藏触发)

// 收藏功能:collectedSet 存当前页已收藏的 ppn_result.id 集合
const collectedSet = ref(new Set())

// 判断用户是否登录(读 localStorage token)
const isLoggedIn = () => !!localStorage.getItem('token')

// 判断某条记录是否已收藏
const isCollected = (ppnResultId) => collectedSet.value.has(ppnResultId)

// PPN 分页:直接把 page/page_count 作为请求参数传给后端(避免 1 万条全量加载超时)
const currentPage = ref(1)
const pageSize = ref(50)  // 默认每页 50 条
const totalPages = computed(() => Math.max(1, Math.ceil(ppnTotal.value / pageSize.value)))

// HQ 筛选滑块(默认在极值=灰=不筛;拨动离开极值=高亮;点"搜索"才生效请求)
// HQ_M_AV 范围 [50, 800], 默认 50(极小值)= 灰,不筛
// HQ_SUP  范围 [2, 50],  默认 50(极大值)= 灰,不筛
// IC_SUP  范围 [2, 20],  默认 20(极大值)= 灰,不筛
const hqMavMin = ref(50)
const hqSupMax = ref(50)
const icSupMax = ref(20)
// 滑块是否离开极值(高亮依据;仅视觉,实际生效需点搜索)
const mavActive = computed(() => hqMavMin.value > 50)
const supActive = computed(() => hqSupMax.value < 50)
const icSupActive = computed(() => icSupMax.value < 20)

// 表头排序(三态:不排序 → 升序 → 降序 → 不排序)
// sortField: 当前排序字段, sortOrder: 'asc'|'desc'|''
// 默认 HQ_M_AV 倒序:用户首先看的是 HQ_M_AV 比较大的记录
const sortField = ref('hq_m_avg')
const sortOrder = ref('desc')

// 点击表头切换排序状态
// 三态循环: 不排序 → 降序 → 升序 → 不排序(首次点击默认降序,看最大值)
const toggleSort = (field) => {
  if (sortField.value !== field) {
    // 切换到新字段,默认降序
    sortField.value = field
    sortOrder.value = 'desc'
  } else {
    // 同字段三态循环: desc → asc → 空(不排序) → desc
    if (sortOrder.value === 'desc') {
      sortOrder.value = 'asc'
    } else if (sortOrder.value === 'asc') {
      // 取消排序
      sortField.value = ''
      sortOrder.value = ''
    } else {
      sortOrder.value = 'desc'
    }
  }
  // 排序变化需重新请求数据,回到第 1 页
  currentPage.value = 1
  fetchPpns()
}

// 排序图标 class(三态)
// 不排序: fa-sort 灰色; 升序: fa-sort-asc 蓝色; 降序: fa-sort-desc 蓝色
const getSortIconClass = (field) => {
  if (sortField.value !== field || !sortOrder.value) {
    return 'text-gray-300'  // 不排序=灰色
  }
  if (sortOrder.value === 'asc') {
    return 'text-blue-500 fa-sort-asc'  // 升序
  }
  return 'text-blue-500 fa-sort-desc'  // 降序
}

// 当前页展示数据:t_ppn_result 已由后端分页返回;t_ppn 全量返回,前端分页
const pagedPpns = computed(() => {
  if (ppnSrc.value === 'ppn') {
    const start = (currentPage.value - 1) * pageSize.value
    return ppnList.value.slice(start, start + pageSize.value)
  }
  return ppnList.value
})

const pageRange = computed(() => {
  const range = []
  const maxShow = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxShow / 2))
  let end = start + maxShow - 1
  if (end > totalPages.value) {
    end = totalPages.value
    start = Math.max(1, end - maxShow + 1)
  }
  for (let i = start; i <= end; i++) range.push(i)
  return range
})

// ==================== 数据加载 ====================
const formatDate = (s) => (s ? String(s).split(' ')[0] : '-')

const fetchTask = async () => {
  loading.value = true
  try {
    const taskId = route.params.taskId
    const resp = await axios.get(`${API_BASE_URL}/task/read`, {
      params: { filter_contend: `TID = ${taskId}` },
      timeout: 30000,
    })
    if (resp.data?.code !== 200) {
      throw new Error(resp.data?.message || 'task/read 失败')
    }
    const rows = resp.data.data || []
    if (!rows.length) {
      task.value = null
      return
    }
    const r = rows[0]
    // 列顺序: TID, Tname, Tdes, Tstate, Tlevel, tkind, TstartDate, TendDate
    task.value = {
      taskId: r[0],
      taskName: r[1] || '',
      taskDesc: r[2] || '',
      Tstate: r[3],
      Tlevel: r[4],
      tkind: r[5],
      uploadDate: formatDate(r[6]),
      endDate: formatDate(r[7]),
    }
    // 同步初始化 form,使显示模式也能正确展示任务名称/描述/状态/优先级/结束日期
    form.value = {
      taskName: task.value.taskName,
      taskDesc: task.value.taskDesc,
      Tstate: task.value.Tstate,
      Tlevel: task.value.Tlevel,
      uploadDate: task.value.uploadDate && task.value.uploadDate !== '-' ? task.value.uploadDate : '',
      endDate: task.value.endDate && task.value.endDate !== '-' ? task.value.endDate : '',
    }
  } catch (e) {
    console.error('加载任务详情失败:', e)
    toast.error(`加载任务详情失败: ${e.message}`)
    task.value = null
  } finally {
    loading.value = false
  }
}

const fetchPpns = async () => {
  if (!task.value) {
    ppnList.value = []
    return
  }
  ppnLoading.value = true
  try {
    // 已完成/简化版完成(2/4)→ 从 t_ppn_result(with_hq) 取(含指标);其他状态 → 从 t_ppn 取
    if (isResultBased.value) {
      ppnSrc.value = 'result'
      const resp = await axios.get(`${API_BASE_URL}/ppn/with_hq`, {
        params: {
          filter_contend: `task_name = "${task.value.taskName}"`,
          page: currentPage.value,
          page_count: pageSize.value,  // 传 page_count 启用后端分页,避免 1 万条全量加载超时
          // HQ 筛选:滑块离开极值才传参(默认极值=不筛=显示全部)
          ...(hqMavMin.value > 50 ? { hq_m_av_min: hqMavMin.value } : {}),
          ...(hqSupMax.value < 50 ? { hq_sup_max: hqSupMax.value } : {}),
          ...(icSupMax.value < 20 ? { ic_sup_max: icSupMax.value } : {}),
          // 排序参数:有 sortField 才传
          ...(sortField.value ? { sort_field: sortField.value, sort_order: sortOrder.value } : {}),
        },
        timeout: 30000,
      })
      if (resp.data?.code !== 200) {
        throw new Error(resp.data?.message || 'ppn/with_hq 失败')
      }
      // 新格式:后端返回对象列表(含 id 字段用于收藏定位)
      ppnList.value = (resp.data.data || []).map(r => ({
        id: r.id,  // t_ppn_result 主键,收藏功能定位记录用
        ppn: r.ppn,
        manu_name: r.manu_name || '',
        task_name: r.task_name || '',
        digikey_status: r.digikey_status || '',
        hq_m_avg: r.hq_m_avg ?? 0,
        hq_sup_count: r.hq_sup_count ?? 0,
        hq_stock: r.hq_stock ?? 0,
        ic_sup_count: r.ic_sup_count ?? 0,
        ic_stock: r.ic_stock ?? 0,
        efind_all_sup: r.efind_all_sup ?? 0,
        wheat_global: r.wheat_global ?? 0,
        wheat_ru: r.wheat_ru ?? 0,
        oc_price: r.oc_price ?? null,
        oc_stock: r.oc_stock ?? 0,
        fromResult: true,
      }))
      // 后端返回 total(总记录数);不传 page_count 时 total=len(data)
      ppnTotal.value = resp.data.total ?? ppnList.value.length
    } else {
      // 非已完成任务:t_ppn 原始 PPN 列表(无指标),全量返回后前端分页
      ppnSrc.value = 'ppn'
      const resp = await axios.get(`${API_BASE_URL}/ppn/read`, {
        params: { filter_contend: `source = "${task.value.taskName}"` },
        timeout: 30000,
      })
      if (resp.data?.code !== 200) {
        throw new Error(resp.data?.message || 'ppn/read 失败')
      }
      const rows = resp.data.data || []
      // service 返回二维数组,列顺序: ppn, manu_id, manu_name, source, note, upload_date
      ppnList.value = rows.map(r => ({
        id: null,  // t_ppn 无主键收藏定位,不做收藏
        ppn: r[0],
        manu_name: r[2] || '',
        source: r[3] || '',
        note: r[4] || '',
        upload_date: r[5] || '',
        hq_m_avg: null,
        hq_sup_count: null,
        hq_stock: null,
        ic_sup_count: null,
        ic_stock: null,
        fromResult: false,
      }))
      ppnTotal.value = ppnList.value.length
    }
    // 首次加载或刷新时回到第 1 页(但如果用户手动切页再刷新,则保持当前页)
    selectedPpns.value = []
    // 加载当前页的收藏状态(用户已登录才查)
    await fetchCollectedStatus()
  } catch (e) {
    console.error('加载 PPN 列表失败:', e)
    toast.error(`加载 PPN 列表失败: ${e.message}`)
    ppnList.value = []
    ppnTotal.value = 0
  } finally {
    ppnLoading.value = false
  }
}

const loadAll = async () => {
  await fetchTask()
  currentPage.value = 1  // 首次加载从第 1 页开始
  await fetchPpns()
}

// 手动切页 → 后端分页:重新请求当前页数据
const goToPage = async (p) => {
  if (p < 1 || p > totalPages.value || p === currentPage.value) return
  currentPage.value = p
  await fetchPpns()
}

// HQ 滑块筛选改变(松开时触发)→ 回到第 1 页重新请求
const onFilterChange = async () => {
  currentPage.value = 1
  await fetchPpns()
}

// 重置筛选(滑块回极值=灰=不筛,排序恢复默认 HQ_M_AV 倒序,重新加载全部)
const resetFilter = () => {
  hqMavMin.value = 50
  hqSupMax.value = 50
  icSupMax.value = 20
  sortField.value = 'hq_m_avg'
  sortOrder.value = 'desc'
  onFilterChange()
}

// ==================== 收藏功能 ====================
// 批量查询当前页 PPN 的收藏状态(用户已登录才查)
const fetchCollectedStatus = async () => {
  collectedSet.value = new Set()  // 清空,避免翻页残留
  if (!isLoggedIn()) return  // 未登录无需查询
  const userId = localStorage.getItem('userId')
  const ids = ppnList.value.map(r => r.id).filter(Boolean)
  if (!ids.length) return
  try {
    const resp = await axios.get(`${API_BASE_URL}/ppn_store/check`, {
      params: { user_id: userId, ppn_ids: ids.join(',') },
      timeout: 10000,
    })
    if (resp.data?.code === 200) {
      collectedSet.value = new Set(resp.data.data.collected_ids || [])
    }
  } catch (e) {
    // 收藏状态加载失败不阻塞主流程,静默处理
    console.warn('加载收藏状态失败:', e)
  }
}

// 点击收藏按钮
const toggleFavorite = async (item) => {
  // 未登录 → 弹出登录框
  if (!isLoggedIn()) {
    showLoginModal.value = true
    return
  }
  const userId = localStorage.getItem('userId')
  // 预检查:userId 或 item.id 缺失时给明确提示,避免后端 400
  if (!userId) {
    toast.error('登录信息缺失(userId 为空),请退出重新登录')
    console.error('[toggleFavorite] userId 缺失,localStorage:', {
      token: localStorage.getItem('token'),
      userId: localStorage.getItem('userId'),
      username: localStorage.getItem('username'),
    })
    return
  }
  if (!item || !item.id) {
    toast.error('记录 id 缺失,无法收藏(请刷新页面后重试)')
    console.error('[toggleFavorite] item.id 缺失, item=', item)
    return
  }
  // 乐观更新:立即切换 UI,不等后端响应(反应快)
  const wasCollected = collectedSet.value.has(item.id)
  const optimistic = new Set(collectedSet.value)
  if (wasCollected) optimistic.delete(item.id)
  else optimistic.add(item.id)
  collectedSet.value = optimistic
  try {
    const resp = await axios.post(`${API_BASE_URL}/ppn_store/toggle`, {
      user_id: userId,
      ppn_id: item.id,
    }, { timeout: 10000 })
    if (resp.data?.code === 200) {
      const collected = resp.data.data.collected
      // 以后端返回为准,纠正乐观更新(防止状态漂移)
      const finalSet = new Set(collectedSet.value)
      if (collected) finalSet.add(item.id)
      else finalSet.delete(item.id)
      collectedSet.value = finalSet
      toast.success(resp.data.message || (collected ? '收藏成功' : '已取消收藏'))
    } else {
      // 回滚乐观更新
      const rollback = new Set(collectedSet.value)
      if (wasCollected) rollback.add(item.id)
      else rollback.delete(item.id)
      collectedSet.value = rollback
      toast.error(resp.data?.message || '操作失败')
    }
  } catch (e) {
    // 回滚乐观更新
    const rollback = new Set(collectedSet.value)
    if (wasCollected) rollback.add(item.id)
    else rollback.delete(item.id)
    collectedSet.value = rollback
    console.error('切换收藏失败:', e)
    toast.error(`切换收藏失败: ${e.message}`)
  }
}

// 登录弹窗成功回调:刷新收藏状态
const onLoginSuccess = async () => {
  showLoginModal.value = false
  toast.success('登录成功')
  // 登录后重新加载当前页收藏状态
  await fetchCollectedStatus()
}

// ==================== 任务编辑 ====================
const enterEdit = () => {
  if (!task.value) return
  form.value = {
    taskName: task.value.taskName,
    taskDesc: task.value.taskDesc,
    Tstate: task.value.Tstate,
    Tlevel: task.value.Tlevel,
    uploadDate: task.value.uploadDate && task.value.uploadDate !== '-' ? task.value.uploadDate : '',
    endDate: task.value.endDate && task.value.endDate !== '-' ? task.value.endDate : '',
  }
  editing.value = true
}

// 取消编辑:还原 form 为 task 原值,退出编辑模式
const cancelEdit = () => {
  if (!task.value) return
  form.value = {
    taskName: task.value.taskName,
    taskDesc: task.value.taskDesc,
    Tstate: task.value.Tstate,
    Tlevel: task.value.Tlevel,
    uploadDate: task.value.uploadDate && task.value.uploadDate !== '-' ? task.value.uploadDate : '',
    endDate: task.value.endDate && task.value.endDate !== '-' ? task.value.endDate : '',
  }
  editing.value = false
}

const saveTask = async () => {
  if (!form.value.taskName.trim()) {
    toast.warning('任务名称不能为空')
    return
  }
  if (saving.value) return
  saving.value = true
  // 等待一帧,确保 loading 状态先渲染到 DOM,再发起请求
  await new Promise(r => requestAnimationFrame(r))
  const startTime = Date.now()
  // 最小 loading 显示时长(ms),避免请求过快导致 loading 一闪而过
  const MIN_LOADING = 600
  // 显示 loading toast
  const loadingToast = toast.loading('正在保存任务...')

  // 任务名称变更:需要同步迁移关联 PPN 的 source 字段
  const oldName = task.value.taskName
  const newName = form.value.taskName.trim()
  const nameChanged = newName !== oldName
  // 任务状态变更:PPN 数据来源可能切换(t_ppn_result ↔ t_ppn),需重新加载
  const oldState = task.value.Tstate
  const stateChanged = form.value.Tstate !== oldState

  try {
    const payload = {
      TID: task.value.taskId,
      Tname: newName,
      Tdes: form.value.taskDesc.trim(),
      Tstate: form.value.Tstate,
      Tlevel: form.value.Tlevel,
      // 上传日期:空值传 null,避免数据库写入空字符串
      TstartDate: form.value.uploadDate ? form.value.uploadDate : null,
      // 结束日期:空值传 null,避免数据库写入空字符串
      TendDate: form.value.endDate ? form.value.endDate : null,
    }
    const resp = await axios.post(`${API_BASE_URL}/task/update`, payload, { timeout: 15000 })
    if (resp.data?.code !== 200) {
      throw new Error(resp.data?.message || '保存失败')
    }

    // 任务名变更后,同步更新关联 PPN 的 source(使列表不丢失关联)
    if (nameChanged) {
      try {
        // 先读取旧 source 的所有 PPN,再以新 source 重写
        const readResp = await axios.get(`${API_BASE_URL}/ppn/read`, {
          params: { filter_contend: `source = "${oldName}"` },
          timeout: 30000,
        })
        if (readResp.data?.code === 200 && (readResp.data.data || []).length) {
          const rows = readResp.data.data.map(r => ({
            ppn: r[0],
            manu_id: r[1],
            manu_name: r[2] || '',
            source: newName,
            note: r[4] || '',
          }))
          await axios.post(`${API_BASE_URL}/ppn/write`, rows, { timeout: 60000 })
        }
      } catch (syncErr) {
        // source 同步失败不阻塞主流程,仅提示
        console.warn('同步 PPN source 失败:', syncErr)
        toast.warning(`任务已更新,但同步关联 PPN 的 source 失败:${syncErr.message}`)
      }
    }

    // 保证 loading 至少显示 MIN_LOADING,避免请求过快导致 loading 一闪而过
    const elapsed = Date.now() - startTime
    if (elapsed < MIN_LOADING) {
      await new Promise(r => setTimeout(r, MIN_LOADING - elapsed))
    }
    task.value.taskName = newName
    task.value.taskDesc = form.value.taskDesc.trim()
    task.value.Tstate = form.value.Tstate
    task.value.Tlevel = form.value.Tlevel
    task.value.uploadDate = form.value.uploadDate || '-'
    task.value.endDate = form.value.endDate || '-'
    editing.value = false
    loadingToast.close()
    toast.success('任务保存成功')

    // 名称或状态变更后需重新加载 PPN(名称变更→新 source 查询;状态变更→切换数据来源)
    if (nameChanged || stateChanged) {
      currentPage.value = 1
      await fetchPpns()
    }
  } catch (e) {
    console.error('保存任务失败:', e)
    // 保证 loading 至少显示 MIN_LOADING
    const elapsed = Date.now() - startTime
    if (elapsed < MIN_LOADING) {
      await new Promise(r => setTimeout(r, MIN_LOADING - elapsed))
    }
    loadingToast.close()
    toast.error(`保存失败: ${e.message}`)
  } finally {
    saving.value = false
  }
}

// ==================== PPN 选择/删除 ====================
const isSelected = (item) =>
  selectedPpns.value.some(s => s.ppn === item.ppn && s.manu_name === item.manu_name)

const toggleSelect = (item) => {
  if (isSelected(item)) {
    selectedPpns.value = selectedPpns.value.filter(
      s => !(s.ppn === item.ppn && s.manu_name === item.manu_name)
    )
  } else {
    selectedPpns.value.push({ ppn: item.ppn, manu_name: item.manu_name })
  }
}

const allSelected = computed(() =>
  pagedPpns.value.length > 0 &&
  pagedPpns.value.every(item => isSelected(item))
)
const someSelected = computed(() =>
  !allSelected.value && pagedPpns.value.some(item => isSelected(item))
)

const toggleSelectAll = () => {
  if (allSelected.value) {
    // 取消当前页的全选
    const pageItems = pagedPpns.value
    selectedPpns.value = selectedPpns.value.filter(
      s => !pageItems.some(p => p.ppn === s.ppn && p.manu_name === s.manu_name)
    )
  } else {
    // 选中当前页所有
    const pageItems = pagedPpns.value.map(p => ({ ppn: p.ppn, manu_name: p.manu_name }))
    for (const item of pageItems) {
      if (!isSelected(item)) selectedPpns.value.push(item)
    }
  }
}

// 最小 loading 显示时长(ms),避免本地快请求导致遮罩一闪而过
const MIN_LOADING_MS = 500

const deletePpn = async (item) => {
  if (!confirm(`确定删除 PPN【${item.ppn}】(${item.manu_name || '-'})吗?`)) return
  // 整个删除+重载周期内显示 loading 遮罩
  ppnLoading.value = true
  const startTime = Date.now()
  try {
    const resp = await axios.post(`${API_BASE_URL}/ppn/delete`, [{
      ppn: item.ppn,
      manu_name: item.manu_name,
    }], { timeout: 15000 })
    if (resp.data?.code !== 200) {
      throw new Error(resp.data?.message || '删除失败')
    }
    toast.success(`已删除 PPN: ${item.ppn}`)
    await fetchPpns()
  } catch (e) {
    console.error('删除 PPN 失败:', e)
    toast.error(`删除失败: ${e.message}`)
  } finally {
    // 保证 loading 至少显示 MIN_LOADING_MS,避免遮罩一闪而过
    const elapsed = Date.now() - startTime
    if (elapsed < MIN_LOADING_MS) {
      await new Promise(r => setTimeout(r, MIN_LOADING_MS - elapsed))
    }
    ppnLoading.value = false
  }
}

const batchDeletePpn = async () => {
  if (!selectedPpns.value.length) return
  if (!confirm(`确定批量删除选中的 ${selectedPpns.value.length} 条 PPN 吗?`)) return
  // 整个删除+重载周期内显示 loading 遮罩
  ppnLoading.value = true
  const startTime = Date.now()
  try {
    const resp = await axios.post(`${API_BASE_URL}/ppn/delete`, selectedPpns.value, { timeout: 30000 })
    if (resp.data?.code !== 200) {
      throw new Error(resp.data?.message || '批量删除失败')
    }
    toast.success(`已批量删除 ${selectedPpns.value.length} 条 PPN`)
    selectedPpns.value = []
    await fetchPpns()
  } catch (e) {
    console.error('批量删除 PPN 失败:', e)
    toast.error(`批量删除失败: ${e.message}`)
  } finally {
    // 保证 loading 至少显示 MIN_LOADING_MS,避免遮罩一闪而过
    const elapsed = Date.now() - startTime
    if (elapsed < MIN_LOADING_MS) {
      await new Promise(r => setTimeout(r, MIN_LOADING_MS - elapsed))
    }
    ppnLoading.value = false
  }
}

// ==================== PPN 下载 CSV ====================
const downloadPpnCsv = () => {
  if (!ppnList.value.length) {
    toast.warning('当前任务没有关联的 PPN 数据')
    return
  }
  const header = ['ppn', 'manu_id', 'manu_name', 'source', 'note', 'upload_date']
  const csvLines = [header.join(',')]
  ppnList.value.forEach(r => {
    const line = [r.ppn, r.manu_id, r.manu_name, r.source, r.note, r.upload_date].map(v => {
      const s = (v === null || v === undefined) ? '' : String(v)
      return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s
    }).join(',')
    csvLines.push(line)
  })
  const csv = '\ufeff' + csvLines.join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${task.value.taskName}_ppn.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ==================== PPN 新增回调 ====================
const onPpnAdded = () => {
  showAddPpnModal.value = false
  fetchPpns()
}

// ==================== 导入指标回调 ====================
const onUploadSuccess = () => {
  showUploadModal.value = false
  fetchPpns()
}

// ==================== 导航 ====================
const goBack = () => {
  router.push('/analysis/task')
}

// 跳转到 PPN 分析结果详情页(复用 ModelData 页面)
const goToPpnDetail = (ppn) => {
  if (!ppn) return
  router.push(`/analysis/query/model/${encodeURIComponent(ppn)}`)
}

onMounted(() => {
  loadAll()
})
</script>

<style scoped>
label { text-align: left !important; display: block; }
.overflow-x-auto { scrollbar-width: thin; scrollbar-color: #cbd5e0 #f7fafc; }
.overflow-x-auto::-webkit-scrollbar { height: 6px; }
.overflow-x-auto::-webkit-scrollbar-track { background: #f7fafc; }
.overflow-x-auto::-webkit-scrollbar-thumb { background-color: #cbd5e0; border-radius: 3px; }
td, th { white-space: nowrap; }
/* loading 按钮不透明禁用,用 :class 控制视觉 */
</style>
