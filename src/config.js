/**
 * 统一的前端环境配置入口。
 *
 * 所有组件统一从这里读取 API 地址，不再各自硬编码。
 *
 * 环境变量(在 ui 目录的 .env.development / .env.production 中配置):
 *   - VITE_API_BASE_URL: 后端 service 的基础地址。
 *     开发环境: http://localhost:8001/api/data
 *     生产环境: /api/data(由网关/反向代理转发到后端)
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/data'

export { API_BASE_URL }

export default {
  API_BASE_URL,
}