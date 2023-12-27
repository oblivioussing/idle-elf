<template>
  <!-- search -->
  <chant-table-search
    v-model="state"
    :dict="dict"
    :lang="lang"
    @query="getList"
    @refresh="lister.refresh(getList, state)">
  </chant-table-search>
  <!-- operation -->
  <chant-table-operation
    v-model="state"
    :lang="lang"
    :options="['add', 'alter', 'delete']"
    split-button
    @add="lister.add"
    @alter="onAlter"
    @command="onCommand">
    <el-button type="primary">拉黑</el-button>
    <el-button type="danger">禁用</el-button>
    <!-- 批量修改选项 -->
    <template #alter-option>
      <el-dropdown-menu>
        <el-dropdown-item command="1">姓名</el-dropdown-item>
        <el-dropdown-item command="2">年龄</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </chant-table-operation>
  <!-- table -->
  <chant-table v-model="state" :dict="dict" :lang="lang">
    <!-- 操作 -->
    <template #operate>
      <!-- 编辑 -->
      <el-button link type="primary" @click="onEdit">编辑</el-button>
      <!-- 复制 -->
      <el-button link type="primary" @click="onEdit">复制</el-button>
      <!-- 删除 -->
      <el-button link type="danger" @click="onEdit">删除</el-button>
    </template>
  </chant-table>
  <!-- pagination -->
  <chant-pagination
    v-model="state.pages"
    :total="state.total"
    @change="getList">
  </chant-pagination>
  <!-- 批量修改 -->
  <batch-alter v-if="state.batchAlter" v-model="state.batchAlter"></batch-alter>
</template>

<script setup lang="ts" name="user-user-list-index">
import { reactive } from 'vue'
import { useLister } from '@/use'
import { columns, dict, lang } from './share'
import BatchAlter from './components/BatchAlter.vue' // 批量修改

// use
const lister = useLister()
// state
const state = reactive({
  ...lister.state,
  columns,
  list: [
    { id: 1, name: '张三', age: '10', sex: '0' },
    { id: 2, name: '李四', age: '20', sex: '1' }
  ],
  batchAlter: false
})
// init
state.query = {
  name: '张三',
  createTimeStart: new Date().getTime(),
  createTimeEnd: new Date().getTime()
}
// created
lister.created(() => {
  // 获取列表
  getList()
})
// 获取列表
function getList() {
  // lister.getData('xx/xxx', state)
}
// 编辑
function onEdit() {}
// 批量修改
function onAlter() {
  state.batchAlter = true
}
// 批量修改command
function onCommand(val: any) {
  console.log(val)
}
</script>

<style scoped lang="scss"></style>
