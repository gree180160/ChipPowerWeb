<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-left">分析管理 > 分析查询</h2>
    </div>

    <!-- 筛选条件区域 -->
    <div class="bg-white p-4 rounded-md shadow-sm mb-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4 text-left">筛选条件</h3>
      
      <!-- 第一行筛选：型号、品牌、产品类别 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1">型号</label>
          <input
            v-model="searchParams.model"
            type="text"
            placeholder="输入型号"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm w-full"
          />
        </div>
        <div class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1">品牌</label>
          <select
            v-model="searchParams.brand"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option v-for="item in brandOptions" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
        </div>
        <div class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1">产品类别</label>
          <select
            v-model="searchParams.productCategory"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option v-for="item in productCategoryOptions" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
        </div>
      </div>
      
      <!-- 第二行筛选：更新日期、得分范围、状态 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1">更新日期</label>
          <div class="flex items-center w-full">
            <input
              v-model="searchParams.startDate"
              type="date"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm flex-1"
            />
            <span class="text-gray-500 whitespace-nowrap mx-2">至</span>
            <input
              v-model="searchParams.endDate"
              type="date"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm flex-1"
            />
          </div>
        </div>
        <div class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1">得分范围</label>
          <div class="flex items-center space-x-2">
            <input
              v-model="searchParams.minScore"
              type="number"
              placeholder="最小值"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm flex-1"
            />
            <span class="text-gray-500">-</span>
            <input
              v-model="searchParams.maxScore"
              type="number"
              placeholder="最大值"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm flex-1"
            />
          </div>
        </div>
        <div class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1">状态</label>
          <select
            v-model="searchParams.status"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option v-for="item in statusOptions" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
        </div>
      </div>
      
      <!-- 第三行筛选：物料等级 + 按钮区域 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div class="flex flex-col">
          <label class="text-sm text-gray-700 mb-1">物料等级</label>
          <select
            v-model="searchParams.materialGrade"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option v-for="item in materialGradeOptions" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
        </div>
        <div></div>
        <div class="flex justify-end space-x-3">
          <button
            class="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            @click="resetSearch"
          >
            重置
          </button>
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            @click="fetchAnalysisData"
          >
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
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">型号</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">品牌</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">更新日期</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">产品大类</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">产品小类</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">得分</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">等级</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">H-A</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">H-L</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S-U</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">W-W</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">W-R</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P-R</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">12个月库存趋势</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- 加载状态 -->
            <tr v-if="loading">
              <td colspan="16" class="px-6 py-8 text-center text-gray-500">
                <i class="fa fa-spinner fa-spin mr-2"></i>加载中...
              </td>
            </tr>
            
            <!-- 无数据状态 -->
            <tr v-else-if="!materialList.length">
              <td colspan="16" class="px-6 py-8 text-center text-gray-500">
                <i class="fa fa-search-minus mr-2"></i>暂无数据
              </td>
            </tr>
            
            <!-- 物料数据列表 -->
            <tr v-else v-for="(item, index) in materialList" :key="item.model" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.model }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.brand }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="item.status === 'Active' ? 'bg-green-100 text-green-800' : 
                         item.status === 'Inactive' ? 'bg-red-100 text-red-800' : 
                         'bg-yellow-100 text-yellow-800'"
                >
                  {{ item.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.updateDate }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.productCategory }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.productSubCategory }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.score }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="item.grade === 'A+' ? 'bg-blue-100 text-blue-800' : 
                         item.grade === 'A' ? 'bg-green-100 text-green-800' : 
                         item.grade === 'B+' ? 'bg-yellow-100 text-yellow-800' : 
                         item.grade === 'B' ? 'bg-orange-100 text-orange-800' : 
                         'bg-red-100 text-red-800'"
                >
                  {{ item.grade }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.hA }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.hL }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.sU }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.wW }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.wR }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.pR }}</td>
              
              <!-- 库存趋势图 -->
              <td class="px-6 py-4 whitespace-nowrap" style="min-width: 200px;">
                <div 
                  :id="`chart-${index}`" 
                  class="w-full h-20"
                ></div>
              </td>
              
              <!-- 操作列 -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-900 mr-3">
                  <i class="fa fa-eye mr-1"></i>查看
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
        共 {{ totalCount }} 条记录
      </div>
      <div class="flex items-center space-x-1">
        <button
          class="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
          :disabled="currentPage === 1 || loading"
          @click="changePage(currentPage - 1)"
        >
          <i class="fa fa-chevron-left text-xs"></i>
        </button>
        <button
          v-for="page in pageRange"
          :key="page"
          class="px-3 py-1 border border-gray-300 rounded-md text-sm"
          :class="currentPage === page ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'"
          :disabled="loading"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
        <button
          class="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
          :disabled="currentPage === totalPages || loading"
          @click="changePage(currentPage + 1)"
        >
          <i class="fa fa-chevron-right text-xs"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import * as echarts from 'echarts';

// 分页相关状态
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value));

// 加载状态
const loading = ref(false);

// 物料数据相关状态
const materialList = ref([]);
const chartInstances = ref({}); // 使用对象存储图表实例，键为图表ID

// 筛选参数
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
});

// 下拉选项（预设默认值，确保UI能正常显示）
const brandOptions = ref(['-all-', 'ST', 'Espressif', 'Microchip', 'TI', 'NXP']);
const productCategoryOptions = ref(['-all-', '微控制器', '无线模块', '传感器', '电源管理']);
const statusOptions = ref(['-all-', 'Active', 'Inactive', 'Pending']);
const materialGradeOptions = ref(['-all-', 'A+', 'A', 'B+', 'B', 'C']);

// 生成月份标签（过去12个月）
const getMonthLabels = () => {
  const labels = [];
  const now = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(`${month.getMonth() + 1}月`);
  }
  
  return labels;
};

// 生成分页页码范围
const pageRange = computed(() => {
  const range = [];
  const maxShow = 5;
  if (totalPages.value === 0) return range;
  
  let start = Math.max(1, currentPage.value - Math.floor(maxShow / 2));
  let end = start + maxShow - 1;

  if (end > totalPages.value) {
    end = totalPages.value;
    start = Math.max(1, end - maxShow + 1);
  }
  
  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  return range;
});

// 初始化ECharts图表
const initCharts = () => {
  // 先销毁已存在的图表实例
  Object.values(chartInstances.value).forEach(instance => {
    if (instance && !instance.isDisposed()) {
      instance.dispose();
    }
  });
  chartInstances.value = {};
  
  // 生成月份标签
  const monthLabels = getMonthLabels();
  
  // 为每个数据项初始化图表
  materialList.value.forEach((item, index) => {
    const chartId = `chart-${index}`;
    const chartDom = document.getElementById(chartId);
    
    if (!chartDom) {
      console.warn(`图表DOM元素不存在，ID: ${chartId}`);
      return;
    }
    
    try {
      const chart = echarts.init(chartDom);
      chartInstances.value[chartId] = chart;
      
      // 图表配置
      const option = {
        grid: {
          left: 0,
          right: 0,
          top: 4,
          bottom: 4,
          containLabel: false
        },
        xAxis: {
          type: 'category',
          data: monthLabels,
          show: false
        },
        yAxis: {
          type: 'value',
          show: false
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            const month = monthLabels[params[0].dataIndex];
            const value = params[0].value;
            return `${month}: ${value}`;
          }
        },
        series: [
          {
            data: item.inventoryTrend || Array(12).fill(0).map(() => Math.floor(Math.random() * 100) + 50),
            type: 'line',
            smooth: true,
            symbol: 'none',
            lineStyle: {
              color: '#3b82f6',
              width: 2
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
                  { offset: 1, color: 'rgba(59, 130, 246, 0)' }
                ]
              }
            }
          }
        ]
      };
      
      chart.setOption(option);
      
      // 监听窗口大小变化，重绘图表
      const handleResize = () => {
        if (chart && !chart.isDisposed()) {
          chart.resize();
        }
      };
      
      window.addEventListener('resize', handleResize);
      
      // 记录resize事件处理函数，方便后续清理
      chart.resizeHandler = handleResize;
    } catch (error) {
      console.error(`图表初始化失败，ID: ${chartId}`, error);
    }
  });
};

// 获取分析数据
const fetchAnalysisData = async () => {
  loading.value = true;
  
  try {
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 尝试从JSON文件获取数据
    let response;
    try {
      response = await fetch('/PPNAnalyData.json');
    } catch (error) {
      console.error('网络请求失败，使用模拟数据', error);
      // 使用模拟数据
      const mockData = generateMockData();
      materialList.value = mockData.materialList;
      totalCount.value = mockData.totalCount;
      
      // 等待DOM更新后初始化图表
      nextTick(() => {
        initCharts();
      });
      return;
    }
    
    if (!response.ok) {
      throw new Error(`HTTP错误，状态码: ${response.status}`);
    }
    
    const data = await response.json();

    // 验证数据结构
    if (!data.materialList || !Array.isArray(data.materialList)) {
      throw new Error('数据格式错误，缺少materialList数组');
    }
    
    // 为缺少库存趋势数据的项添加默认数据
    materialList.value = data.materialList.map(item => ({
      ...item,
      inventoryTrend: item.inventoryTrend || Array(12).fill(0).map(() => Math.floor(Math.random() * 100) + 50)
    }));
    totalCount.value = data.totalCount || data.materialList.length;
    
    // 等待DOM更新后初始化图表
    nextTick(() => {
      initCharts();
    });
  } catch (error) {
    console.error('获取分析数据失败:', error);
    // 显示错误信息并使用模拟数据
    alert(`数据加载失败: ${error.message}，将使用模拟数据`);
    
    // 生成模拟数据
    const mockData = generateMockData();
    materialList.value = mockData.materialList;
    totalCount.value = mockData.totalCount;
    
    // 等待DOM更新后初始化图表
    nextTick(() => {
      initCharts();
    });
  } finally {
    loading.value = false;
  }
};

// 生成模拟数据（当JSON文件加载失败时使用）
const generateMockData = () => {
  const brands = ['ST', 'Espressif', 'Microchip', 'TI', 'NXP'];
  const categories = ['微控制器', '无线模块', '传感器', '电源管理'];
  const subCategories = ['MCU', 'WiFi', 'BLE', '温度传感器', '电压调节器'];
  const statuses = ['Active', 'Inactive', 'Pending'];
  const grades = ['A+', 'A', 'B+', 'B', 'C'];
  
  const materialList = [];
  
  for (let i = 0; i < 10; i++) {
    // 生成12个月的随机库存数据
    const inventoryTrend = Array(12).fill(0).map(() => Math.floor(Math.random() * 100) + 50);
    
    // 随机生成日期（过去一年内）
    const date = new Date();
    date.setMonth(date.getMonth() - Math.floor(Math.random() * 12));
    const formattedDate = date.toISOString().split('T')[0];
    
    materialList.push({
      model: `Model-${1000 + i}`,
      brand: brands[Math.floor(Math.random() * brands.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      updateDate: formattedDate,
      productCategory: categories[Math.floor(Math.random() * categories.length)],
      productSubCategory: subCategories[Math.floor(Math.random() * subCategories.length)],
      score: Math.floor(Math.random() * 50) + 50,
      grade: grades[Math.floor(Math.random() * grades.length)],
      hA: (Math.random() * 10).toFixed(2),
      hL: (Math.random() * 10).toFixed(2),
      sU: (Math.random() * 10).toFixed(2),
      wW: (Math.random() * 10).toFixed(2),
      wR: (Math.random() * 10).toFixed(2),
      pR: (Math.random() * 10).toFixed(2),
      inventoryTrend: inventoryTrend
    });
  }
  
  return {
    materialList: materialList,
    totalCount: materialList.length
  };
};

// 重置搜索条件
const resetSearch = () => {
  searchParams.value = {
    model: '',
    brand: '-all-',
    productCategory: '-all-',
    startDate: '',
    endDate: '',
    minScore: '',
    maxScore: '',
    status: '-all-',
    materialGrade: '-all-'
  };
  currentPage.value = 1;
  fetchAnalysisData();
};

// 切换页码
const changePage = (page) => {
  if (page < 1 || page > totalPages.value || loading.value) return;
  currentPage.value = page;
  fetchAnalysisData();
};

// 页面加载时初始化
onMounted(() => {
  // 加载数据
  fetchAnalysisData();
  
  // 组件卸载时清理
  return () => {
    // 移除所有事件监听并销毁图表实例
    Object.values(chartInstances.value).forEach(instance => {
      if (instance && !instance.isDisposed()) {
        if (instance.resizeHandler) {
          window.removeEventListener('resize', instance.resizeHandler);
        }
        instance.dispose();
      }
    });
  };
});
</script>

<style scoped>
label {
  text-align: left !important;
  display: block;
}

/* 水平滚动条样式优化 */
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

/* 表格单元格样式 */
td, th {
  white-space: nowrap;
}

/* 图表容器样式 */
[id^="chart-"] {
  min-height: 60px;
}
</style>
    