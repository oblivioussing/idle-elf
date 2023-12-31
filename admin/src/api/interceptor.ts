import { ApiCode } from '../enum'
import shiki from './shiki'

export default () => {
  // 请求拦截器
  shiki.interceptors.request.use((config: RequestInit) => {
    return config
  })
  // 响应拦截器
  shiki.interceptors.response.use(async (response: Response) => {
    return response
  })
}
