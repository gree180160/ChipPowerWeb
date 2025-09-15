import { createRouter, createWebHistory } from 'vue-router'

// 1. 简化组件导入：统一用一行导入，减少重复代码（也可按模块拆分，这里先极简）
const Login = () => import('../views/Login.vue') // 懒加载：访问时才加载组件，优化首屏速度
const Dashboard = () => import('../views/Dashboard.vue')
const DataCenter = () => import('../views/datacenter/DataCenter.vue')
const CategoryManagement = () => import('../views/category/CategoryManager.vue')
const MaterialCenter = () => import('../views/material/MaterialCenter.vue')
const ModelBasicInfo = () => import('../views/material/ModelBasicInfo.vue')
const TaskList = () => import('../views/tasks/TaskList.vue')
const TaskDetail = () => import('../views/tasks/TaskDetail.vue')
const ModelData = () => import('../views/tasks/ModelData.vue')

// 错误写法（缺少 from 参数）

// 正确写法（必须包含 to, from, next 三个参数）
const requireAuth = (to, from, next) => { 
  const isLoggedIn = localStorage.getItem('token')
  // 未登录且访问的不是登录页 → 跳登录；否则正常放行
  !isLoggedIn && to.path !== '/login' ? next('/login') : next()
}

// 3. 简化路由配置：只保留核心字段（path、name、component、children），去掉暂时用不到的 meta（如面包屑）
const routes = [
  // 登录页：独立路由，无需嵌套
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  // 系统首页（Dashboard）：嵌套所有功能路由
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: requireAuth, // 登录后才能访问
    children: [
      //dashboard
      { path: '', name: 'DashboardHome', component: DataCenter }, 
      // 一级功能：数据中心
      { path: 'datacenter', name: 'DataCenter', component: DataCenter },
      // 一级功能：分类管理
      { path: 'category', name: 'CategoryManagement', component: CategoryManagement },
      // 一级功能：物料中心（含二级子路由）
      {
        path: 'material',
        name: 'MaterialCenter',
        component: MaterialCenter,
        children: [
          { path: 'model-info', name: 'ModelBasicInfo', component: ModelBasicInfo } // 二级：型号基础信息
        ]
      },
      // 一级功能：任务列表（含二、三级子路由）
      {
        path: 'tasks',
        name: 'TaskList',
        component: TaskList,
        children: [
          {
            path: ':id', // 二级：任务详情（动态ID，对应单个任务）
            name: 'TaskDetail',
            component: TaskDetail,
            children: [
              { path: 'model-data', name: 'ModelData', component: ModelData } // 三级：型号数据
            ]
          }
        ]
      },
      // 默认子路由：访问 "/" 时，自动跳转到数据中心（避免首页空白）
      { path: '', redirect: 'datacenter' }
    ]
  },
  // 404：未匹配的路由跳首页
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

// 4. 创建路由实例：保留核心配置，去掉暂时用不到的滚动行为
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router