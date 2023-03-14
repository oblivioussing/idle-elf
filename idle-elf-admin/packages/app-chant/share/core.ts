import config from '../conf'
import { Project, Stage } from '../type/index'

export default {
  // 获取当前环境
  getStage(): Stage {
    const stage = import.meta.env.VITE_STAGE as Stage
    return stage
  },
  // 获取版本号
  getVersion() {
    return import.meta.env.VITE_VERSION as string
  },
  // 是否为生产环境
  isProd() {
    return this.getStage() === 'prod'
  },
  // 是否运行在开发环境
  inDevelopment() {
    const arr = ['10.168', '192.168', 'localhost']
    return arr.some((item) => location.href.indexOf(item) >= 0)
  },
  // 获取baseUrl
  getBaseUrl() {
    const stage = this.getStage()
    const project = this.getProject()
    const apiType = this.getApiType()
    return config.getBaseUrl(stage, project, apiType)
  },
  // 获取接口请求地址
  getBaseApiUrl(): string {
    const stage = this.getStage()
    const project = this.getProject()
    const apiType = this.getApiType()
    return config.getBaseApiUrl(stage, project, apiType)
  },
  // 获取fs地址
  getFsUrl(): string {
    const stage = this.getStage()
    const project = this.getProject()
    return config.getFsUrl(stage, project)
  },
  // 获取当前项目
  getProject() {
    return import.meta.env.VITE_PROJECT as Project
  },
  // 获取接口类型
  getApiType() {
    return import.meta.env.VITE_API_TYPE
  },
  // 是否为psa
  isPsa() {
    return this.getApiType() === 'psa'
  },
  // 是否为pta
  isPta() {
    return this.getApiType() === 'pta'
  },
  // 是否为纯净版
  isPure() {
    return import.meta.env.VITE_PURE === '1'
  }
}
