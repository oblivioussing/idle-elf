export default {
  // 获取版本号
  getVersion() {
    return import.meta.env.VITE_VERSION as string
  }
}
