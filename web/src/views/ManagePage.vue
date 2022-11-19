<template>
  <div class="mpage">
    <el-row class="tac">
      <header>
        <p>管理员,您好!</p>
      </header>
      <el-col :span="12">
        <el-menu default-active="1" class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff"
          active-text-color="rgb(64,158,255)">
          <el-menu-item index="1" @click="pages = 1">
            <i class="el-icon-goods"></i>
            <span slot="title">商品信息</span>
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1" style="margin: -14px 0 0 0;" @click="pages = 2">新增商品</el-menu-item>
              <el-menu-item index="1-2" @click="pages = 3">修改商品</el-menu-item>
              <el-menu-item index="1-3" @click="pages = 4">删除商品</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="3" @click="pages = 5">
            <i class="el-icon-document"></i>
            <span slot="title">销售报表</span>
          </el-menu-item>
          <el-menu-item index="4" @click="pages = 6">
            <i class="el-icon-notebook-1"></i>
            <span slot="title">日志记录</span>
          </el-menu-item>
          <el-menu-item index="5" @click="logout">
            <i class="el-icon-setting"></i>
            <span slot="title">退出登录</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
    <div class="content">
      <GoodsManage v-if="pages === 1"></GoodsManage>
      <AddGoods v-else-if="pages === 2"></AddGoods>
      <UpdateGoods v-else-if="pages === 3"></UpdateGoods>
      <DeleteGoods v-else-if="pages === 4"></DeleteGoods>
      <DataChart v-else-if="pages === 5"></DataChart>
      <AboutLogging v-else-if="pages === 6"></AboutLogging>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  async created() {
    if (this.myinfo === null) {
      this.$router.replace('/login')
      return
    }
    const { data } = await this.$http({
      method: 'GET',
      headers: {
        Authorization: localStorage.getItem('token')
      },
      url: '/getfullgoods'
    })
    this.setgoods(data.goods)
  },
  components: {
    GoodsManage: () => import('../components/GoodsManage.vue'),
    AddGoods: () => import('../components/AddGoods.vue'),
    DeleteGoods: () => import('../components/DeleteGoods.vue'),
    UpdateGoods: () => import('../components/UpdateGoods.vue'),
    DataChart: () => import('../components/DataChart.vue'),
    AboutLogging: () => import('../components/AboutLogging.vue')
  },
  computed: {
    ...mapState(['myinfo'])
  },
  data() {
    return {
      pages: 1
    }
  },
  methods: {
    ...mapMutations(['setgoods']),
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('id')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.mpage {

  .tac {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 200px;
    height: 100vh !important;
    background-color: rgb(84, 92, 100);

    header {

      p {
        padding: 7px 15px;
        font-size: 14px;
        color: white;
      }
    }

    .el-col {
      width: 100%;

      li {
        width: 200px;
      }
    }
  }

  .content {
    margin-left: 200px;
  }
}
</style>
