<template>
  <div class="p-6">
    <!-- 页面标题与操作区 -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-xl font-semibold text-gray-800">物料管理 > 分类管理</h1>
      <div class="flex gap-3">
        <button class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
          分类树状图
        </button>
        <button class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
          <i class="mr-1">+</i> 新增分类
        </button>
      </div>
    </div>

    <!-- 查询条件区域 -->
    <div class="bg-white p-5 rounded-lg shadow-sm mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="flex items-center gap-2">
          <label class="text-gray-600 whitespace-nowrap">分类名称：</label>
          <input 
            type="text" 
            placeholder="请输入分类名称" 
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
        </div>
        <div class="flex items-center gap-2">
          <label class="text-gray-600 whitespace-nowrap">状态：</label>
          <select class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
            <option value="">请选择状态</option>
            <option value="1">启用</option>
            <option value="0">停用</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-gray-600 whitespace-nowrap">创建时间：</label>
          <input 
            type="text" 
            placeholder="选择时间范围" 
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <button class="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
          查询
        </button>
      </div>
    </div>

    <!-- 分类表格 -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类编码</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类名称</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">上级分类</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">型号数量</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">MT001</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">原材料</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">无</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">125</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-12-01 10:30</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">启用</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <button class="text-blue-600 hover:text-blue-900 mr-3">编辑</button>
              <button class="text-red-600 hover:text-red-900 mr-3">删除</button>
              <button class="text-color-#4B5563 hover:text-green-900 fa fa-download mx-2">导出</button>
            </td>
          </tr>
          <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">MT002</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">半成品</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">无</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">89</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-12-01 14:20</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">停用</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <button class="text-blue-600 hover:text-blue-900 mr-3">编辑</button>
              <button class="text-red-600 hover:text-red-900 mr-3">删除</button>
              <button class="text-color-#4B5563 hover:text-green-900 fa fa-download mx-2">导出</button>
            </td>
          </tr>
          <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">MT003</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">成品</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">无</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">256</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-12-02 09:15</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">启用</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <button class="text-blue-600 hover:text-blue-900 mr-3">编辑</button>
              <button class="text-red-600 hover:text-red-900 mr-3">删除</button>
              <button class="text-color-#4B5563 hover:text-green-900 fa fa-download mx-2">导出</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="flex justify-between items-center mt-4 text-sm">
      <div class="text-gray-600">
        显示 1 至 10 条，共 2351 条
      </div>
      <div class="flex items-center gap-1">
        <button class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>
          <i>&lt;</i>
        </button>
        <button class="px-3 py-1 border border-green-500 bg-green-50 text-green-700 rounded">1</button>
        <button class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">2</button>
        <button class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">3</button>
        <button class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">...</button>
        <button class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">236</button>
        <button class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
          <i>&gt;</i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// 分类管理页面逻辑可在此添加
</script>
