import { defineStore } from 'pinia'
import { RouteRecordRaw } from 'vue-router'
import { shiki, Api } from '../api'
import { IndexCode, StorageEnum, WorkplaceTypeEnum } from '../enum'
import factory from '../router/factory'
import router from '../router'
import { base, core, storage } from '../share'

export type User = {
  defaultOrgId: string
  defaultOrgName: string
  menuList: RouteRecordRaw[]
  indexCode: IndexCode
  operator: {
    loginName: string
    userInfoBase: {
      id: string
      tenantName: string
      userInfoCode: string
      userInfoName: string
    }
  }
  tenantId: string
  tenantName: string
  tokenName: string
  tokenStr: string
  workplaceType?: WorkplaceTypeEnum // 职场类型
}

export const userDefault: User = {
  defaultOrgId: '',
  defaultOrgName: '',
  menuList: [] as RouteRecordRaw[],
  indexCode: '' as IndexCode,
  operator: {
    loginName: '',
    userInfoBase: {
      id: '',
      tenantName: '',
      userInfoCode: '',
      userInfoName: ''
    }
  },
  tenantId: '',
  tenantName: '',
  tokenName: '',
  tokenStr: '',
  workplaceType: '' as WorkplaceTypeEnum
}

const user: User = storage.getLocal(StorageEnum.User) || base.clone(userDefault)

export const useUserStore = defineStore('user', {
  state: () => {
    return user as User
  },
  actions: {
    // 更新权限
    async updateAuth() {
      if (!this.tokenStr) {
        setTimeout(() => {
          router.push({ path: '/login' })
        }, 0)
        return
      }
      const path = Api.cs + 'ath/getAuth'
      const { data } = await shiki.getData(path)
      if (data) {
        let menuList = data.menuList as RouteRecordRaw[]
        // children中的path去除开始和结尾的斜杠
        menuList = menuList?.map((item) => {
          item.children?.forEach((child) => {
            const path = child?.path
            if (path) {
              child.path = '/' + path?.replace(/^\/|\/$/g, '')
            }
          })
          return item
        })
        const project = core.getProject()
        const indexCodeMap = data.indexCodeMap || {}
        const indexCode = indexCodeMap[project]
        this.indexCode = indexCode
        this.menuList = menuList || []
        user.indexCode = indexCode
        user.menuList = menuList || []
        // 缓存
        storage.setLocal(StorageEnum.User, user)
        // 重新创建路由
        factory()
        return true
      }
    }
  }
})
