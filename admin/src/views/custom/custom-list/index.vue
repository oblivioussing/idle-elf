<template>
  <!-- operation -->
  <chant-operation
    v-model="state"
    :options="['add', 'edit', 'delete']"
    @add="lister.add(state)"
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

<script setup lang="ts" name="custom-custom-list-index">
import { reactive } from 'vue'
import { useLister } from '@/use'
import { columns } from './share'

// use
const lister = useLister()
// state
const state = reactive({
  ...lister.state,
  columns,
  list: [{ id: 1 }, { id: 2 }]
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
