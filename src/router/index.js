import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import DataCenter from '../views/datacenter/DataCenter.vue'
import CategoryManagement from '../views/category/CategoryManager.vue'
import MaterialCenter from '../views/material/MaterialCenter.vue'
import TaskManagement from '../views/analysis/TaskManagement.vue'
import AnalysisQuery from '../views/analysis/AnalysisQuery.vue'
import MonitorTask from '../views/monitor/MonitorTask.vue'
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
      { path: 'category', name: 'CategoryManagement', component: CategoryManagement },
      { path: 'material', name: 'MaterialCenter', component: MaterialCenter },
      { path: 'analysis/task', name: 'TaskManagement', component: TaskManagement },
      { path: 'analysis/query', name: 'AnalysisQuery', component: AnalysisQuery },
      { path: 'monitor/task', name: 'MonitorTask', component: MonitorTask },
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
