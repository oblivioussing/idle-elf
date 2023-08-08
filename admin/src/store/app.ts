import { defineStore } from 'pinia'
import { reactive } from 'vue'
import storage from '../share/storage'
import { StorageEnum } from '../enum'
import { type PageRelation } from '../type'

// 页面对应关系
const pageRelation = storage.getSession(
  StorageEnum.PageRelation
) as unknown as PageRelation

export const useAppStore = defineStore('app', () => {
  // state
  const state = reactive({
    pageRelation: pageRelation || {}, // 页面对应关系
    pageModules: {} // 页面模块
  })
  // 更新页面对应关系
  function updatePageRelation(path: string, parent: string) {
    state.pageRelation[path] = { parent }
    storage.setSession(StorageEnum.PageRelation, state.pageRelation)
  }

  return { state, updatePageRelation }
})
