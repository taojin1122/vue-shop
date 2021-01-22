<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容区域 -->
    <el-card>
      <!-- 2、为Echarts准备一个具备大小的Dom -->
      <div id="main" style="width：600px;height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
// 1、 导入echarts 4.9 版本的echarts
import echarts from 'echarts'
// 导入lodash 合并，深拷贝对象
import _ from 'lodash'

export default {
  data() {
    return {
      options: {
        title: {
          text: '用户来源',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
      },
    }
  },
  created() {},
  //   此时,页面上的元素，已经被渲染完毕
  async mounted() {
    console.log(echarts)
    // 3、基于准备好的dom， 创建echarts实例
    var myChart = echarts.init(document.getElementById('main'))

    const { data: res } = await this.$http.get('reports/type/1')
    console.log(res)
    if (res.meta.status !== 200) {
      return this.$message.error('获取数据失败')
    }
    // 4、指定图表的配置项和数据
    var option = {
      title: {
        text: 'ECharts 入门示例',
      },
      tooltip: {},
      legend: {
        data: ['销量'],
      },
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20],
        },
      ],
    }
    const result = _.merge(res.data, this.options)
    // 5、展示数据
    myChart.setOption(result)
  },
}
</script>

<style lang="less" scoped>
</style>
