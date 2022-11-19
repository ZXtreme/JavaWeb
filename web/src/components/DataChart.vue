<template>
  <div class="dataChart">
    <div class="block">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize"
        layout="prev, pager, next, jumper" :total="goods.length">
      </el-pagination>
    </div>
    <div class="chart"></div>
    <div class="profit"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { mapState } from 'vuex'
export default {
  mounted() {
    const x = ['', '', '', '', '']
    const y = [0, 0, 0, 0, 0]
    const y1 = [0, 0, 0, 0, 0]
    for (let i = (this.currentPage - 1) * this.pageSize, j = 0; i < Math.min(this.currentPage * this.pageSize, this.goods.length); i++, j++) {
      x[j] = this.goods[i].goodsname
      y[j] = this.goods[i].sold_num
      y1[j] = (this.goods[i].sold_num * this.goods[i].price).toFixed(2)
    }
    this.option.xAxis.data = x
    this.option1.xAxis.data = x
    this.option.series[0].data = y
    this.option1.series[0].data = y1
    const myChart = echarts.init(document.querySelector('.chart'))
    myChart.setOption(this.option)
    const myChart1 = echarts.init(document.querySelector('.profit'))
    myChart1.setOption(this.option1)
  },
  computed: {
    ...mapState(['goods'])
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 5,
      option: {
        tooltip: {},
        xAxis: {
          data: ['A', 'B', 'C', 'D', 'E'],
          name: '商品编号'
        },
        yAxis: {
          name: '销售量'
        },
        series: [
          {
            name: '销售量',
            data: [0, 0, 0, 0, 0],
            type: 'bar',
            itemStyle: {
              color: '#91cc75',
              shadowColor: '#91cc75',
              opacity: 0.5
            }
          }
        ]
      },
      option1: {
        tooltip: {},
        xAxis: {
          data: ['A', 'B', 'C', 'D', 'E'],
          name: '商品编号'
        },
        yAxis: {
          name: '营业额/元'
        },
        series: [
          {
            name: '营业额',
            data: [0, 0, 0, 0, 0],
            type: 'bar',
            itemStyle: {
              color: 'rgb(84,112,198)',
              shadowColor: '#91cc75',
              opacity: 0.5
            }
          }
        ]
      }
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val
      const x = ['', '', '', '', '']
      const y = [0, 0, 0, 0, 0]
      const y1 = [0, 0, 0, 0, 0]
      // 在goods数组中截取目标下标范围内的表格信息
      for (let i = (this.currentPage - 1) * this.pageSize, j = 0; i < Math.min(this.currentPage * this.pageSize, this.goods.length); i++, j++) {
        x[j] = this.goods[i].goodsname
        y[j] = this.goods[i].sold_num
        y1[j] = (this.goods[i].sold_num * this.goods[i].price).toFixed(2)
      }
      this.option.xAxis.data = x
      this.option1.xAxis.data = x
      this.option.series[0].data = y
      this.option1.series[0].data = y1
      // 重新渲染chart
      const myChart = echarts.init(document.querySelector('.chart'))
      myChart.setOption(this.option)
      const myChart1 = echarts.init(document.querySelector('.profit'))
      myChart1.setOption(this.option1)
    }
  }
}
</script>

<style lang="less" scoped>
.dataChart {
  .block {
    margin-top: 20px;
    text-align: center;
  }

  .chart,
  .profit {
    margin: 0 auto;
    width: 80%;
    height: 400px;
  }
}
</style>
