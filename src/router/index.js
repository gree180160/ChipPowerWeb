import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import DataCenter from '../views/datacenter/DataCenter.vue'
import CategoryManagement from '../views/material/CategoryManagement.vue'
import MaterialCenter from '../views/material/MaterialCenter.vue'
import ModelBasicInfo from '../views/material/ModelBasicInfo.vue'
import AnalysisTaskManagement from '../views/analysis/AnalysisTaskManagement.vue'
import AnalysisTaskDetail from '../views/analysis/AnalysisTaskDetail.vue'
import AnalysisQuery from '../views/analysis/AnalysisQuery.vue'
import ModelData from '../views/analysis/ModelData.vue'
import MonitorTaskManager from '../views/monitor/MonitorTaskManager.vue'
import MonitorTaskDetail from '../views/monitor/MonitorTaskDetail.vue'
import MonitorQuery from '../views/monitor/MonitorQuery.vue'
import Transaction from '../views/transaction/Transaction.vue'
import System from '../views/system/System.vue'

// 路由守卫
const requireAuth = (to, from, next) => {
  const isLoggedIn = localStorage.getItem('token')
  !isLoggedIn && to.path !== '/login' ? next('/login') : next()
}

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: requireAuth,
    children: [
      { path: '', redirect: { name: 'DataCenter' }},
      { path: 'datacenter', name: 'DataCenter', component: DataCenter },
      { path: 'material/categorymanagement', name: 'CategoryManagement', component: CategoryManagement },
      { path: 'material/materialcenter', name: 'MaterialCenter', component: MaterialCenter },
      { path: 'material/modelBasicInfo', name: 'ModelBasicInfo', component: ModelBasicInfo },
      { path: 'analysis/task', name: 'TaskManagement', component: AnalysisTaskManagement },
      { path: 'analysis/task/:taskId', name: 'TaskDetail', component: AnalysisTaskDetail },
      { path: 'analysis/query', name: 'AnalysisQuery', component: AnalysisQuery },
      { path: 'analysis/query/model/:model', name: 'ModelData', component: ModelData },
      { path: 'monitor/task', name: 'MonitorTask', component: MonitorTaskManager },
      { path: 'monitor/task/:taskId', name: 'MonitorTaskDetail', component: MonitorTaskDetail },
      { path: 'monitor/query', name: 'MonitorQuery', component: MonitorQuery },
      { path: 'transaction', name: 'Transaction', component: Transaction },
      { path: 'system', name: 'System', component: System }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
