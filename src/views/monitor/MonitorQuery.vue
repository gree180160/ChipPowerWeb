<!-- 无法和监控任务名称关联 -->
<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-900 text-left">监控管理 > PPN查询</h2>
    </div>

    <!-- 筛选条件区域 - 按要求调整顺序 -->
    <div class="bg-white p-5 rounded-lg shadow-sm mb-6">
      <form class="space-y-6">
        <!-- 第1行筛选条件：型号，品牌，产品类别 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- 型号 -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-2 text-left">型号</label>
            <input v-model="searchForm.model" type="text" placeholder="请输入型号"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>

          <!-- 品牌 -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-2 text-left">品牌</label>
            <select v-model="searchForm.brand"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">-all-</option>
              <option value="ST">ST</option>
              <option value="Espressif">Espressif</option>
              <option value="TI">TI</option>
              <option value="Microchip">Microchip</option>
              <option value="Nordic">Nordic</option>
            </select>
          </div>

          <!-- 产品类别 -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-2 text-left">产品类别</label>
            <select v-model="searchForm.productCategory"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">-all-</option>
              <option value="MCU">MCU</option>
              <option value="WiFi">WiFi</option>
              <option value="Bluetooth">Bluetooth</option>
              <option value="Sensor">Sensor</option>
            </select>
          </div>
        </div>

        <!-- 第2行筛选条件：开始监控日期，更新日期，得分范围 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- 开始监控日期 -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-2 text-left">开始监控日期</label>
            <input v-model="searchForm.startMonitorDate" type="date"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>

          <!-- 更新日期 -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-2 text-left">更新日期</label>
            <input v-model="searchForm.updateDate" type="date"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>

          <!-- 得分范围 -->
          <div class="flex flex-col">
            <label class="text-sm text-gray-700 mb-1 text-left">得分范围</label>
            <div class="flex items-center space-x-2">
              <input v-model="searchForm.minScore" type="number" placeholder="最小值"
                class="px-3 py-2 border border-gray-300 rounded-md text-sm flex-1" />
              <span class="text-gray-500">-</span>
              <input v-model="searchForm.maxScore" type="number" placeholder="最大值"
                class="px-3 py-2 border border-gray-300 rounded-md text-sm flex-1" />
            </div>
          </div>
        </div>

        <!-- 第3行筛选条件：状态，物料等级，监控提示 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- 状态 -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-2 text-left">状态</label>
            <select v-model="searchForm.status"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">-all-</option>
              <option value="Active">Active</option>
              <option value="NRND">NRND</option>
              <option value="Obsolete">Obsolete</option>
            </select>
          </div>

          <!-- 物料等级 -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-2 text-left">物料等级</label>
            <select v-model="searchForm.materialLevel"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">-all-</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>

          <!-- 监控提示 -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-2 text-left">监控提示</label>
            <select v-model="searchForm.monitorTip"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">-all-</option>
              <option value="up">↑</option>
              <option value="down">↓</option>
              <option value="none">—</option>
            </select>
          </div>
        </div>

        <!-- 按钮区域 -->
        <div class="flex justify-end space-x-3 pt-2">
          <button type="button" @click="resetForm"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            重置
          </button>
          <button type="button" @click="fetchData"
            class="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            查询
          </button>
        </div>
      </form>
    </div>

    <!-- 物料监控列表 -->
    <div class="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
      <div class="flex justify-between items-center p-4">
        <h3 class="text-lg font-medium text-gray-900">物料监控列表</h3>
        <button @click="handleExportData"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <i class="fa fa-download mr-2"></i>导出数据
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">型号
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">品牌
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                开始监控日期</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">更新日期
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">得分
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">等级
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">H-A
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">H-L
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SU
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">W-W
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">W-R
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P-R
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">监控提示
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">趋势图
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- 加载状态 -->
            <tr v-if="loading">
              <td colspan="16" class="px-6 py-12 text-center text-gray-500">
                <div class="flex items-center justify-center">
                  <i class="fa fa-spinner fa-spin mr-2"></i>
                  <span>加载中...</span>
                </div>
              </td>
            </tr>

            <!-- 无数据状态 -->
            <tr v-else-if="materialList.length === 0">
              <td colspan="16" class="px-6 py-12 text-center text-gray-500">
                <div class="flex items-center justify-center">
                  <i class="fa fa-search-minus mr-2"></i>
                  <span>暂无数据</span>
                </div>
              </td>
            </tr>

            <!-- 物料数据行 -->
            <template v-else>
              <tr v-for="(material, index) in materialList" :key="material.id"
                class="hover:bg-gray-50 transition-colors duration-200">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ material.model }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ material.brand }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="statusStyles[material.status]">
                    {{ material.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ material.startMonitorDate }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ material.updateDate }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ material.score }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="levelStyles[material.level]">
                    {{ material.level }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="material.hA" class="text-green-600">✔</span>
                  <span v-else class="text-red-600">✖</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="material.hL" class="text-green-600">✔</span>
                  <span v-else class="text-red-600">✖</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="material.su" class="text-green-600">✔</span>
                  <span v-else class="text-red-600">✖</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="material.ww" class="text-green-600">✔</span>
                  <span v-else class="text-red-600">✖</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="material.wr" class="text-green-600">✔</span>
                  <span v-else class="text-red-600">✖</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="material.pr" class="text-green-600">✔</span>
                  <span v-else class="text-red-600">✖</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="material.monitorTip === 'up'" class="text-green-600">↑</span>
                  <span v-if="material.monitorTip === 'down'" class="text-red-600">↓</span>
                  <span v-if="material.monitorTip === 'none'">—</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <!-- 趋势图容器 - 高度降低为原来的70% (原为8px，现为5.6px) -->
                  <div :id="`chart-${material.id}`" class="w-24 h-[5.6rem]"
                    :data-inventory="JSON.stringify(material.inventoryData)"></div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button @click="handleViewDetail(material)"
                    class="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors duration-200">
                    <i class="fa fa-eye mr-1.5"></i>
                    <span>详情</span>
                  </button>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 分页控件 -->
    <div v-if="total > 0"
      class="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
      <!-- 左侧：每页显示条数设置 -->
      <div class="mb-4 sm:mb-0 flex items-center text-sm text-gray-700">
        <span class="mr-2">共 {{ total }} 条数据，每页</span>
        <select v-model="pageSize" @change="handlePageSizeChange"
          class="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          :disabled="loading">
          <option value="20">20条</option>
          <option value="50">50条</option>
          <option value="100">100条</option>
        </select>
        <span class="ml-2">页</span>
      </div>

      <!-- 右侧：分页控制和页码跳转 -->
      <div class="flex items-center space-x-4">
        <span class="text-sm text-gray-700">跳至</span>
        <input v-model="jumpPage" type="number"
          class="w-12 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @keyup.enter="handleJumpPage" :disabled="loading" />
        <span class="text-sm text-gray-700">页</span>

        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button @click="changePage(1)" :disabled="currentPage === 1 || loading"
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <i class="fa fa-angle-double-left"></i>
          </button>
          <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1 || loading"
            class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <i class="fa fa-angle-left"></i>
          </button>

          <button v-for="page in visiblePages" :key="page" @click="changePage(page)" :disabled="loading"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium"
            :class="{
              'z-10 bg-blue-50 border-blue-500 text-blue-600': currentPage === page,
              'text-gray-700 hover:bg-gray-50': currentPage !== page
            }">
            {{ page }}
          </button>

          <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages || loading"
            class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <i class="fa fa-angle-right"></i>
          </button>
          <button @click="changePage(totalPages)" :disabled="currentPage === totalPages || loading"
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <i class="fa fa-angle-double-right"></i>
          </button>
        </nav>

        <button @click="handleJumpPage"
          class="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
          :disabled="!jumpPage || jumpPage < 1 || jumpPage > totalPages || loading">
          确定
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import * as echarts from 'echarts';

// 搜索表单数据
const searchForm = ref({
  model: '',
  brand: '',
  productCategory: '',
  startMonitorDate: '',
  updateDate: '',
  minScore: '',
  maxScore: '',
  status: '',
  materialLevel: '',
  monitorTip: ''
});

// 物料列表数据
const materialList = ref([]);
const total = ref(0);
const loading = ref(false);

// 分页参数
const currentPage = ref(1);
const pageSize = ref(20);
const jumpPage = ref('');

// 状态样式映射
const statusStyles = {
  'Active': 'bg-green-100 text-green-800',
  'NRND': 'bg-yellow-100 text-yellow-800',
  'Obsolete': 'bg-red-100 text-red-800'
};

// 等级样式映射
const levelStyles = {
  'A': 'bg-blue-100 text-blue-800',
  'B': 'bg-green-100 text-green-800',
  'C': 'bg-yellow-100 text-yellow-800',
  'D': 'bg-red-100 text-red-800'
};

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(total.value / pageSize.value) || 1;
});

// 监听当前页变化，更新跳转输入框
watch(currentPage, (newVal) => {
  jumpPage.value = newVal.toString();
});

// 计算可见页码
const visiblePages = computed(() => {
  const pages = [];
  const maxDisplayed = 5;
  const total = totalPages.value;

  if (total <= maxDisplayed) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    return pages;
  }

  let startPage = Math.max(1, currentPage.value - Math.floor(maxDisplayed / 2));
  let endPage = startPage + maxDisplayed - 1;

  if (endPage > total) {
    endPage = total;
    startPage = Math.max(1, endPage - maxDisplayed + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

// 初始化图表
const initCharts = () => {
  // 等待DOM更新完成
  nextTick(() => {
    materialList.value.forEach(material => {
      const chartDom = document.getElementById(`chart-${material.id}`);
      if (!chartDom) return;

      // 销毁已存在的图表实例
      if (chartDom.chartInstance) {
        chartDom.chartInstance.dispose();
      }

      // 创建新图表实例
      const chart = echarts.init(chartDom);
      chartDom.chartInstance = chart;

      // 提取库存数据
      const inventoryData = material.inventoryData || [];
      const months = inventoryData.map(item => item.month);
      const quantities = inventoryData.map(item => item.quantity);

      // 判断趋势（上升/下降）
      const isIncreasing = quantities[quantities.length - 1] > quantities[0];
      const lineColor = isIncreasing ? '#10b981' : '#ef4444';

      // 图表配置
      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: '{b}: {c} 个'
        },
        grid: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          containLabel: false
        },
        xAxis: {
          type: 'category',
          data: months,
          show: false // 隐藏x轴
        },
        yAxis: {
          type: 'value',
          show: false // 隐藏y轴
        },
        series: [
          {
            data: quantities,
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 2,
              color: lineColor
            },
            symbol: 'none', // 隐藏数据点
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: `${lineColor}40` }, // 带透明度的颜色
                { offset: 1, color: `${lineColor}00` }
              ])
            }
          }
        ]
      };

      // 设置图表配置
      chart.setOption(option);

      // 响应窗口大小变化
      window.addEventListener('resize', () => {
        chart.resize();
      });
    });
  });
};

// 获取数据
const fetchData = async () => {
  loading.value = true;

  try {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    // 加载本地JSON数据
    const response = await fetch('/MonitorPPNListData.json');

    if (!response.ok) {
      throw new Error(`数据加载失败: ${response.status}`);
    }

    const data = await response.json();

    // 模拟筛选逻辑
    let filteredList = [...data.materialList];

    if (searchForm.value.model) {
      filteredList = filteredList.filter(item =>
        item.model.includes(searchForm.value.model)
      );
    }

    if (searchForm.value.brand) {
      filteredList = filteredList.filter(item =>
        item.brand === searchForm.value.brand
      );
    }

    if (searchForm.value.productCategory) {
      filteredList = filteredList.filter(item =>
        item.productCategory === searchForm.value.productCategory
      );
    }

    if (searchForm.value.startMonitorDate) {
      filteredList = filteredList.filter(item =>
        item.startMonitorDate === searchForm.value.startMonitorDate
      );
    }

    if (searchForm.value.updateDate) {
      filteredList = filteredList.filter(item =>
        item.updateDate === searchForm.value.updateDate
      );
    }

    if (searchForm.value.minScore) {
      filteredList = filteredList.filter(item =>
        item.score >= Number(searchForm.value.minScore)
      );
    }

    if (searchForm.value.maxScore) {
      filteredList = filteredList.filter(item =>
        item.score <= Number(searchForm.value.maxScore)
      );
    }

    if (searchForm.value.status) {
      filteredList = filteredList.filter(item =>
        item.status === searchForm.value.status
      );
    }

    if (searchForm.value.materialLevel) {
      filteredList = filteredList.filter(item =>
        item.level === searchForm.value.materialLevel
      );
    }

    if (searchForm.value.monitorTip) {
      filteredList = filteredList.filter(item =>
        item.monitorTip === searchForm.value.monitorTip
      );
    }

    // 模拟分页处理
    total.value = filteredList.length;
    const startIndex = (currentPage.value - 1) * pageSize.value;
    const endIndex = startIndex + pageSize.value;
    materialList.value = filteredList.slice(startIndex, endIndex);

    // 确保跳转页码在有效范围内
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value || 1;
    }

    // 初始化图表
    initCharts();
  } catch (error) {
    console.error('获取数据失败:', error);
    alert('数据加载失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  searchForm.value = {
    model: '',
    brand: '',
    productCategory: '',
    startMonitorDate: '',
    updateDate: '',
    minScore: '',
    maxScore: '',
    status: '',
    materialLevel: '',
    monitorTip: ''
  };
  currentPage.value = 1;
  fetchData();
};

// 切换页码
const changePage = (page) => {
  if (page < 1 || page > totalPages.value || loading.value) {
    return;
  }
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  fetchData();
};

// 处理每页显示条数变化
const handlePageSizeChange = () => {
  currentPage.value = 1;
  fetchData();
};

// 处理页码跳转
const handleJumpPage = () => {
  const page = parseInt(jumpPage.value, 10);
  if (Number.isInteger(page) && page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchData();
  } else {
    alert(`请输入1到${totalPages.value}之间的页码`);
    jumpPage.value = currentPage.value.toString();
  }
};

// 导出数据
const handleExportData = () => {
  alert('导出所有数据功能待实现');
};

// 查看详情
const handleViewDetail = (material) => {
  alert(`查看物料 ${material.model} 的详情`);
};

// 页面加载时获取数据
onMounted(() => {
  fetchData();

  // 监听窗口大小变化，重新调整图表大小
  window.addEventListener('resize', () => {
    materialList.value.forEach(material => {
      const chartDom = document.getElementById(`chart-${material.id}`);
      if (chartDom && chartDom.chartInstance) {
        chartDom.chartInstance.resize();
      }
    });
  });
});
</script>

<style scoped>
/* 表格滚动条样式优化 */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f7fafc;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 3px;
}

/* 按钮禁用样式 */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button:disabled:hover {
  background-color: transparent;
}

/* 输入框样式优化 */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* 表格行样式优化 */
tr {
  transition: background-color 0.2s ease;
}

/* 图表容器样式 */
::v-deep .echarts-container {
  transition: all 0.3s ease;
}
</style>
    