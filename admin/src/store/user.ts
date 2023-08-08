import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { StorageEnum } from '../enum'
import { storage } from '../share'

export type User = {
  token: string
}

const user: User = storage.getLocal(StorageEnum.User) || {}

export const useUserStore = defineStore('user', () => {
  const state = reactive(user)
  return state
})
