<template>
  <!-- operation -->
  <chant-operation
    v-model="state"
    :options="['add', 'edit', 'delete']"
    @add="lister.add"
    @query="getList"
    @refresh="lister.refresh(getList, state)">
  </chant-operation>
  <!-- table -->
  <chant-table v-model="state"></chant-table>
  <!-- pagination -->
  <chant-pagination
    v-model="state.pages"
    :total="state.total"
    @change="getList">
  </chant-pagination>
</template>

<script setup lang="ts" name="user-user-list-index">
import { reactive } from 'vue'
import { useLister } from '@/use'
import { columns, dict, lang } from './share'

// use
const lister = useLister()
// state
const state = reactive({
  ...lister.state,
  columns,
  dict,
  lang,
  list: [
    { id: 1, name: '张三', age: '10', sex: '0' },
    { id: 2, name: '李四', age: '20', sex: '1' }
  ]
})
// created
lister.created(() => {
  // 获取列表
  // getList()
})
// 获取列表
function getList() {
  lister.getData('xx/xxx', state)
}
</script>

<style scoped lang="scss"></style>
