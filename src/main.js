import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import './assets/tailwind.css'
import router from './router/index.js'  // 引入路由配置

// 创建应用并使用路由
createApp(App)
  .use(router)
  .mount('#app')

