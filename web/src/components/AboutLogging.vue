<template>
  <div class="log">
    <el-table :data="tableData" stripe style="width: 100%" height="500">
      <el-table-column prop="id" label="账号">
      </el-table-column>
      <el-table-column prop="username" label="用户名">
      </el-table-column>
      <el-table-column prop="time" label="时间">
      </el-table-column>
      <el-table-column prop="goodsname" label="商品编号">
      </el-table-column>
      <el-table-column prop="buynums" label="购买量">
      </el-table-column>
      <el-table-column prop="profit" label="营业额(元)">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  async created() {
    const { data } = await this.$http({
      method: 'GET',
      headers: {
        Authorization: localStorage.getItem('token')
      },
      url: '/getlog'
    })
    if (data.status === 200) {
      this.tableData = data.logs
    }
  },
  data() {
    return {
      tableData: []
    }
  }
}
</script>

<style>
.log {
  margin: 20px 5%;
}
</style>
