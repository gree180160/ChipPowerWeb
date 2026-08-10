<template>
  <div class="container mx-auto px-4 py-6 bg-white">
    <!-- 头部信息：型号和品牌左对齐 -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-start mb-8">
      <div class="text-left">
        <h1 class="text-2xl font-bold text-gray-900">{{ basicInfo?.model || '加载中...' }}</h1>
        <p class="text-gray-600">{{ basicInfo?.brand || '' }}</p>
      </div>
      <div class="flex space-x-3 mt-4 md:mt-0">
        <!-- 导出数据按钮：添加点击事件 -->
        <button 
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center gap-2"
          @click="handleExportData"
        >
          <i class="fa fa-download"></i>
          <span>导出数据</span>
        </button>
        <!-- 分享按钮：添加点击事件 -->
        <button 
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2"
          @click="handleShare"
        >
          <i class="fa fa-share-alt"></i>
          <span>分享</span>
        </button>
      </div>
    </div>

    <!-- 物料基础信息 -->
    <div v-if="basicInfo" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- 芯片预览图：灰色背景 + 点击小图切换大图 -->
      <div class="md:col-span-1">
        <!-- 大图显示区域 -->
        <div class="bg-gray-100 p-2 rounded mb-3">
          <img :src="activeBigImage" alt="物料大图" class="w-full h-auto rounded object-contain" />
        </div>
        <!-- 小图片画廊：灰色边框 + 活跃态高亮 + 点击切换 -->
        <div class="flex space-x-2">
          <!-- 原图小图（新增，保持与你原有小图数量一致可删除） -->
          <img 
            :src="basicInfo.image" 
            alt="缩略图-原图" 
            class="w-16 h-16 object-cover rounded cursor-pointer transition-all border border-gray-300"
            :class="activeBigImage === basicInfo.image ? 'border-2 border-blue-500 ring-1 ring-blue-300' : ''"
            @click="switchBigImage(basicInfo.image)"
          />
          <!-- 原有小图1 -->
          <img 
            :src="basicInfo.thumbnail1" 
            alt="缩略图1" 
            class="w-16 h-16 object-cover rounded cursor-pointer transition-all border border-gray-300"
            :class="activeBigImage === basicInfo.thumbnail1 ? 'border-2 border-blue-500 ring-1 ring-blue-300' : ''"
            @click="switchBigImage(basicInfo.thumbnail1)"
          />
          <!-- 原有小图2 -->
          <img 
            :src="basicInfo.thumbnail2" 
            alt="缩略图2" 
            class="w-16 h-16 object-cover rounded cursor-pointer transition-all border border-gray-300"
            :class="activeBigImage === basicInfo.thumbnail2 ? 'border-2 border-blue-500 ring-1 ring-blue-300' : ''"
            @click="switchBigImage(basicInfo.thumbnail2)"
          />
        </div>
      </div>
      <div class="md:col-span-2 space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <!-- 物料状态：左对齐 + 宽度仅比文字多一点 + Active背景色 -->
          <div class="text-left">
            <p class="text-gray-500 text-sm">物料状态</p>
            <span class="font-medium px-2 py-1 rounded inline-block w-fit" 
                  :class="basicInfo.status === 'Active' ? 'bg-green-100 text-green-600' : 'text-gray-600'">
              {{ basicInfo.status }}
            </span>
          </div>
          <!-- 规格书：左对齐 -->
          <div class="text-left">
            <p class="text-gray-500 text-sm">规格书</p>
            <a href="#" class="text-blue-500 hover:underline">{{ basicInfo.datasheet }}</a>
          </div>
          <!-- 封装类型：左对齐 -->
          <div class="text-left">
            <p class="text-gray-500 text-sm">封装类型</p>
            <p class="text-gray-900">{{ basicInfo.packageType }}</p>
          </div>
          <!-- 工作温度：左对齐 -->
          <div class="text-left">
            <p class="text-gray-500 text-sm">工作温度</p>
            <p class="text-gray-900">{{ basicInfo.workingTemp }}</p>
          </div>
        </div>
        <!-- 描述：左对齐 -->
        <div class="text-left">
          <p class="text-gray-500 text-sm">描述</p>
          <p class="text-gray-900">{{ basicInfo.description }}</p>
        </div>
      </div>
    </div>
    <div v-else class="flex justify-center items-center h-40">
      <p class="text-gray-500">数据加载中...</p>
    </div>

    <!-- 分析信息：标题居左 + 加大标题与内容间距 + 状态/等级加背景圆角 -->
    <div v-if="basicInfo" class="bg-gray-50 p-6 rounded mb-8 text-left">
      <h2 class="text-xl font-semibold text-gray-900 mb-4 ">分析信息</h2>
      <div class="grid grid-cols-5 gap-4">
        <!-- 入库日期 -->
        <div>
          <p class="text-gray-500 text-sm">入库日期</p>
          <p class="text-gray-900 mt-2">{{ basicInfo.storageDate }}</p>
        </div>
        <!-- 分析状态：背景色+圆角+图标 -->
        <div>
          <p class="text-gray-500 text-sm">分析状态</p>
          <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded-md inline-block font-medium mt-2">
            <i class="fa fa-check text-blue-700 mr-1"></i>
            {{ basicInfo.analysisStatus }}
          </span>
        </div>
        <!-- 分析完成日期 -->
        <div>
          <p class="text-gray-500 text-sm">分析完成日期</p>
          <p class="text-gray-900 mt-2">{{ basicInfo.analysisDate }}</p>
        </div>
        <!-- 等级分类：背景色+圆角 -->
        <div>
          <p class="text-gray-500 text-sm">等级分类</p>
          <span class="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md inline-block font-medium mt-2">
            {{ basicInfo.level }}
          </span>
        </div>
        <!-- 可置性评分 -->
        <div>
          <p class="text-gray-500 text-sm">可置性评分</p>
          <p class="text-blue-500 font-medium mt-2">{{ basicInfo.score }}</p>
        </div>
      </div>
    </div>

    <!-- 产品参数：标题居左 + 内容左对齐 -->
    <div v-if="basicInfo" class="bg-gray-50 p-6 rounded mb-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-4 text-left">产品参数</h2>
      <div class="grid grid-cols-3 gap-8">
        <div class="space-y-6 pb-4">
          <div class="text-left">
            <p class="text-gray-500 text-sm pb-2">内核</p>
            <p class="text-gray-900">{{ basicInfo.core }}</p>
          </div>
          <div class="text-left">
            <p class="text-gray-500 text-sm pb-2">SRAM容量</p>
            <p class="text-gray-900">{{ basicInfo.sram }}</p>
          </div>
          <div class="text-left">
            <p class="text-gray-500 text-sm pb-2">定时器</p>
            <p class="text-gray-900">{{ basicInfo.timers }}</p>
          </div>
        </div>
        <div class="space-y-6 pb-4">
          <div class="text-left">
            <p class="text-gray-500 text-sm pb-2">最高频率</p>
            <p class="text-gray-900">{{ basicInfo.maxFreq }}</p>
          </div>
          <div class="text-left">
            <p class="text-gray-500 text-sm pb-2">工作电压</p>
            <p class="text-gray-900">{{ basicInfo.workingVoltage }}</p>
          </div>
          <div class="text-left">
            <p class="text-gray-500 text-sm pb-2">ADC通道</p>
            <p class="text-gray-900">{{ basicInfo.adcChannels }}</p>
          </div>
        </div>
        <div class="space-y-6 pb-4">
          <div class="text-left">
            <p class="text-gray-500 text-sm pb-2">Flash容量</p>
            <p class="text-gray-900">{{ basicInfo.flash }}</p>
          </div>
          <div class="text-left">
            <p class="text-gray-500 text-sm pb-2">GPIO数量</p>
            <p class="text-gray-900">{{ basicInfo.gpioCount }}</p>
          </div>
          <div class="text-left">
            <p class="text-gray-500 text-sm pb-2">通信接口</p>
            <p class="text-gray-900">{{ basicInfo.commInterfaces }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 相关型号：标题居左 + switch按钮组 -->
    <div v-if="basicInfo" class="bg-gray-50 p-6 rounded mb-8 text-left">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">相关型号</h2>
      <!-- switch按钮组 -->
      <div class="flex space-x-0 mb-4 p-1 inline-block">
        <button 
          class="px-4 py-1 transition-colors"
          :class="activeSwitch === 'other' ? 'bg-white text-blue-900 border-b-3 border-b-blue-600' : 'text-gray-600 hover:text-gray-900 border-b-0 border-b-white'"
          @click="activeSwitch = 'other'"
        >
          其他表述
        </button>
        <button 
          class="px-4 py-1 transition-colors"
          :class="activeSwitch === 'same' ? 'bg-white text-blue-900 border-b-3 border-b-blue-500' : 'text-gray-600 hover:text-gray-900 border-b-0 border-b-white'"
          @click="activeSwitch = 'same'"
        >
          相同产品
        </button>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-white p-4 rounded border border-gray-200">
          <p class="text-gray-900 font-medium pb-2">{{ basicInfo.relatedModel1 }}</p>
          <p class="text-gray-500 text-sm">{{ basicInfo.relatedModel1Desc }}</p>
        </div>
        <div class="bg-white p-4 rounded border border-gray-200">
          <p class="text-gray-900 font-medium pb-2">{{ basicInfo.relatedModel2 }}</p>
          <p class="text-gray-500 text-sm">{{ basicInfo.relatedModel2Desc }}</p>
        </div>
      </div>
    </div>

    <!-- 替代信息：标题居左 + table内容左对齐 + 查看详情功能 -->
    <div v-if="basicInfo" class="bg-gray-50 p-6 rounded text-left">
      <h2 class="text-xl font-semibold text-gray-900 mb-4 text-left">替代信息</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">型号</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">品牌</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">替代类型</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">兼容性</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(alt, index) in basicInfo.alternatives" :key="index">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left">{{ alt.model }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left">{{ alt.brand }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-left">
                <span class="px-2 py-1 inline-block w-fit text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {{ alt.type }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left">{{ alt.compatibility }}%</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-500 text-left">
                <!-- 查看详情：优先尝试跳转，失败则弹窗提示 -->
                <a 
                  href="javascript:;" 
                  class="hover:underline flex items-center gap-1 cursor-pointer"
                  @click="handleViewDetail(alt.model)"
                >
                  <i class="fa fa-eye"></i>
                  <span>查看详情</span>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
// 引入路由（如需跳转功能）
import { useRouter } from 'vue-router';

export default {
  name: 'ModelBasicInfo',
  data() {
    return {
      basicInfo: null,
      PPNID: 'STM32F103C8T6', // 假设的PPNID参数
      activeSwitch: 'same', // 默认选中"相同产品"
      activeBigImage: '', // 活跃的大图地址
      router: null // 路由实例
    };
  },
  created() {
    // 初始化路由实例
    this.router = useRouter();
    // 从路由参数中获取PPNID（如果有）
    this.PPNID = this.router.currentRoute.query.PPNID || this.PPNID;
  },
  mounted() {
    this.fetchMaterialInfo();
  },
  methods: {
    async fetchMaterialInfo() {
      try {
        // 模拟网络请求，实际开发中替换为真实的API请求
        const response = await fetch(`/ModelBasicInfo.json?PPNID=${this.PPNID}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        this.basicInfo = data;
        // 初始化大图为默认图片
        this.activeBigImage = data.image;
      } catch (error) {
        console.error('Error fetching material info:', error);
        alert('获取物料详情失败，请重试！');
      }
    },

    // 功能1：点击小图切换大图
    switchBigImage(imageUrl) {
      this.activeBigImage = imageUrl;
    },

    // 功能2：导出数据按钮点击事件
    handleExportData() {
      if (!this.basicInfo) {
        alert('数据未加载完成，无法导出！');
        return;
      }
      // 模拟导出逻辑
      console.log('导出物料数据：', this.basicInfo);
      alert(`已开始导出 ${this.basicInfo.model} 的物料数据，文件将自动下载！`);
      // 真实场景扩展：调用后端接口下载文件
      // window.location.href = `/api/material/export?PPNID=${this.PPNID}`;
    },

    // 功能3：分享按钮点击事件
    handleShare() {
      if (!this.basicInfo) {
        alert('数据未加载完成，无法分享！');
        return;
      }
      // 生成分享链接
      const shareUrl = `${window.location.origin}/#/material/modelBasicInfo?PPNID=${this.PPNID}`;
      // 尝试复制到剪贴板
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert(`分享链接已复制到剪贴板：\n${shareUrl}`);
      }).catch(err => {
        console.error('复制失败：', err);
        alert(`分享链接：${shareUrl}\n（复制失败，请手动复制）`);
      });
    },

    // 功能4：替代信息查看详情（优先跳转，失败弹窗）
    handleViewDetail(modelPPNID) {
      try {
        // 尝试跳转到对应型号的详情页
        this.router.push({
          name: 'ModelBasicInfo',
          query: { PPNID: modelPPNID }
        });
      } catch (error) {
        // 跳转失败时弹窗提示
        console.error('跳转失败：', error);
        alert(`已选中查看型号 ${modelPPNID} 的详情，跳转功能暂未实现！`);
      }
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}

/* 优化switch按钮组样式 */
button.px-4.py-1 {
  transition: all 0.2s ease;
}

/* 确保表格内容完全左对齐 */
table th.text-left,
table td.text-left {
  text-align: left !important;
}

/* 物料状态宽度优化：仅包裹文字，额外间距最小化 */
.font-medium.px-2.py-1.rounded.inline-block.w-fit {
  white-space: nowrap; /* 防止文字换行 */
  padding: 2px 6px !important; /* 最小内边距，仅比文字多一点 */
  line-height: 1.4; /* 优化行高，避免垂直方向占用过多空间 */
}

/* 图片切换过渡效果优化 */
img.cursor-pointer {
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

/* 大图容器优化：确保图片比例正确 */
.bg-gray-100.p-2.rounded {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px; /* 防止图片过小时容器塌陷 */
}

/* 活跃态小图高亮效果增强 */
.border-2.border-blue-500 {
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.3);
}

/* 按钮图标对齐优化 */
.flex.items-center.gap-2 {
  align-items: center;
}

/* 修复switch按钮组边框样式（你的原有样式修正） */
button.border-b-3 {
  border-bottom-width: 3px !important;
}
button.border-b-0 {
  border-bottom-width: 0 !important;
}
</style>