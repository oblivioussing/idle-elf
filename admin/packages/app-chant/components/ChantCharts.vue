<template>
  <div ref="mainRef" class="chant-charts"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from 'vue'
import * as echarts from 'echarts/core'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  ToolboxComponent
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { ECOption } from '@chant/type'

// props
const props = defineProps<{
  option: ECOption // option
  type: 'line' | 'pie' | 'bar' // 图表类型
}>()
// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  ToolboxComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
])
// 根据图表类型加载响应组件
if (props.type === 'line') {
  echarts.use([LineChart])
} else if (props.type === 'pie') {
  echarts.use([PieChart])
} else if (props.type === 'bar') {
  echarts.use([BarChart])
}
// var
let charts: echarts.ECharts
// ref
const mainRef = ref()
// watch
watch(
  () => props.option,
  () => {
    charts?.setOption(props.option, true)
  },
  { deep: true }
)
// onMounted
onMounted(() => {
  nextTick(() => {
    init()
  })
})
// 初始化
function init() {
  charts = echarts.init(mainRef.value)
  charts.setOption(props.option)
}
</script>

<style scoped lang="scss">
.chant-charts {
  height: 100%;
}
</style>
