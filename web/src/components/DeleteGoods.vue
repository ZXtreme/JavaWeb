<template>
  <div class="del">
    <GoodsManage>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" style="margin-top:10px">删除
          </el-button>
        </template>
      </el-table-column>
    </GoodsManage>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  components: {
    GoodsManage: () => import('../components/GoodsManage.vue')
  },
  methods: {
    ...mapMutations(['setgoods']),
    async handleDelete(index, row) {
      // 发送post请求
      const { data } = await this.$http({
        method: 'post',
        url: '/delete',
        headers: {
          Authorization: localStorage.getItem('token')
        },
        data: {
          id: row.goodsname
        }
      })
      let msg = data.msg
      if (data.status === 200) {
        // 更新成功后，获取最新的商品信息
        const { data } = await this.$http({
          method: 'get',
          headers: {
            Authorization: localStorage.getItem('token')
          },
          url: '/getfullgoods'
        })
        if (data.status === 200) {
          this.setgoods(data.goods)
          msg = '删除成功'
        } else msg = '服务器未知错误'
      }
      // 展示结果
      alert(msg)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
