
<template>
    <div class="flex h-screen">
      <!-- 侧边栏 -->
      <aside>...</aside>
      
      <!-- 主内容区：子路由（如 DataCenter）会渲染到这里 -->
      <div class="flex-1">
        <!-- 面包屑、顶部导航 -->
        <header>...</header>
        <p>categoryManager</p>
        <!-- 子路由挂载点！必须有这行 -->
        <main class="p-6">

          <router-view />
        </main>
      </div>
    </div>
  </template>