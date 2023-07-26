import { defineStore } from 'pinia'
import { storage } from '../share'
import { LangEnum, StorageEnum } from '../enum'
import { SysDict, DefaultValue, PageRelation } from '../type'

// 字典
const dict = storage.getLocal(StorageEnum.Dict) as SysDict
// 默认值
const defaultValue = storage.getLocal(StorageEnum.DefaultValue) as DefaultValue
// 语言
const lang = storage.getLocal(StorageEnum.Lang) as LangEnum
// 页面对应关系
const pageRelation = storage.getSession(
  StorageEnum.PageRelation
) as unknown as PageRelation

export const useAppStore = defineStore('app', {
  state: () => ({
    dict: dict || {}, // 字典
    defaultValue: defaultValue || {}, // 默认值
    lang: lang || LangEnum.Zh, // 语言
    logo: '', // logo
    pageRelation: pageRelation || {}, // 页面对应关系
    pageModules: {} // 页面模块
  }),
  actions: {
    // 更新页面对应关系
    updatePageRelation(path: string, parent: string) {
      this.pageRelation[path] = { parent }
      storage.setSession(StorageEnum.PageRelation, this.pageRelation)
    }
  }
})
