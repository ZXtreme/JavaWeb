<template>
  <div class="management">
    <article>
      <div class="data">
        <el-table :data="solve(goods)" style="width: 100%">
          <el-table-column label="商品编号">
            <template slot-scope="scope">
              {{ scope.row.goodsname }}
            </template>
          </el-table-column>
          <el-table-column label="商品描述" width="180">
            <template slot-scope="scope">
              {{ scope.row.description }}
            </template>
          </el-table-column>
          <el-table-column label="商品图片" width="180">
            <template slot-scope="scope">
              <img :src="'http://127.0.0.1/goods/' + scope.row.goodsname + '.png'" alt=""
                style="width:150px;border-radius: 10px;">
            </template>
          </el-table-column>
          <el-table-column label="价格">
            <template slot-scope="scope">
              ¥{{ scope.row.price }}
            </template>
          </el-table-column>
          <el-table-column label="存货量">
            <template slot-scope="scope">
              {{ scope.row.store_num }}
            </template>
          </el-table-column>
          <el-table-column label="销售量">
            <template slot-scope="scope">
              {{ scope.row.sold_num }}
            </template>
          </el-table-column>
          <el-table-column label="是否在售">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.selling" active-color="#13ce66" inactive-color="#ff4949" disabled>
              </el-switch>
            </template>
          </el-table-column>
          <slot></slot>
        </el-table>
      </div>
      <div class="block">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize"
          layout="prev, pager, next, jumper" :total="goods.length">
        </el-pagination>
      </div>
    </article>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['goods'])
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val
    },
    solve(val) {
      const arr = []
      for (let i = (this.currentPage - 1) * this.pageSize; i < Math.min(this.currentPage * this.pageSize, this.goods.length); i++) {
        const obj = {}
        for (const k in val[i]) {
          obj[k] = val[i][k]
        }
        obj.selling = obj.selling === 1
        arr.push(obj)
      }
      return arr
    }
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 5
    }
  }
}
</script>

<style lang="less" scoped>
.management {
  background-color: rgb(244, 244, 244);

  article {
    margin: 0 5%;
    text-align: center;

    .block {
      display: inline-block;
      margin: 20px 0;
    }
  }
}
</style>
