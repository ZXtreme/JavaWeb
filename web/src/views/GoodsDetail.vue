<template>
  <div class="detail">
    <PageHeader>
      <i class="el-icon-s-home" style="color:red"></i> <i id="tag" @click="$router.push('/')">购物首页&nbsp;&nbsp;&nbsp;</i>
    </PageHeader>
    <div class="box">
      <div class="subbox">
        <div class="left">
          <img :src="'http://127.0.0.1/goods/' + id + '.png'" alt="">
        </div>
        <div class="right">
          <h3>{{ info.description }}</h3>
          <p style="font-size:14px;color:rgba(0,0,0,.4);line-height: 22px;">销售量: {{ info.sold_num }}</p>
          <p style="color:rgb(255, 79, 0);font-size: 16px;line-height: 34px;">¥ <em
              style="font-style: normal;font-size: 28px">{{
                  info.price
              }}</em></p>
          <p>
            <el-form :model="formInline" class="demo-form-inline">
              <el-form-item label="配送:">
                <el-input v-model="formInline.addr" placeholder="收货地址" style="width:80%"></el-input>
              </el-form-item>
              <el-form-item label="数量:">
                <el-input-number v-model="num" :min="1" :max="9999" size="small">
                </el-input-number>
              </el-form-item>
              <el-form-item label="总价:">
                <p style="color:rgb(255, 79, 0);font-size: 16px;line-height: 34px;">¥
                  <em style="font-style: normal;font-size: 28px">{{ (info.price * num).toFixed(2) }}</em>
                </p>
              </el-form-item>
            </el-form>
          </p>
          <button id="btn" @click="pay">立即购买</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: ['id'],
  computed: {
    ...mapState(['myinfo', 'goods'])
  },
  data() {
    return {
      info: {},
      num: 1,
      formInline: {
        addr: ''
      }
    }
  },
  components: {
    PageHeader: () => import('../components/PageHeader.vue')
  },
  created() {
    if (this.myinfo === null) {
      this.$router.push('/login')
    }
    const numId = this.id * 1
    for (let i = 0; i < this.goods.length; i++) {
      if (this.goods[i].goodsname === numId) {
        this.info = this.goods[i]
        break
      }
    }
  },
  methods: {
    async pay() {
      // 完备性检验, 验证是否处于登录状态
      if (localStorage.getItem('token') === null) {
        this.$router.replace('/login')
        return
      }

      // 验证表单信息是否全部填写
      if (this.formInline.addr === '') {
        alert('请填写您的收货地址!')
        return
      }

      // 发送post请求, 请求进行交易, 参数包括token、商品编号、商品名称、购买数量、收货地址
      const { data } = await this.$http({
        method: 'POST',
        url: '/soldgoods',
        headers: {
          Authorization: localStorage.getItem('token')
        },
        data: {
          goodsname: this.id,
          description: this.info.description,
          num: this.num,
          addr: this.formInline.addr
        }
      })

      // 展示后端处理结果
      const { status, msg } = data
      alert(msg)

      // 若交易成功, 跳转到购物主界面
      if (status === 200) {
        this.$router.push('/')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.detail {
  min-width: 1200px;

  #tag {
    font-style: normal;

    &:hover {
      color: rgb(255, 0, 54);
      cursor: pointer;
    }
  }

  .box {
    background-color: rgb(233, 223, 217);
    padding: 30px 5%;
    min-height: calc(100vh - 33px);

    .subbox {
      background-color: #fff;
      border-radius: 20px;
      display: flex;
      padding: 3%;
      align-items: center;

      .left {
        flex: 1;
        padding-left: 30px;

        img {
          width: 80%;
          border-radius: 20px;
        }
      }

      .right {
        flex: 2;

        #btn {
          background: linear-gradient(90deg, rgb(255, 119, 0), rgb(255, 73, 0));
          box-shadow: rgb(255 119 0 / 20%) 0px 9px 13px 0px;
          vertical-align: top;
          border-radius: 34px;
          padding: 0 60px;
          outline: 0;
          font-family: 'PingFang SC';
          border: 0;
          cursor: pointer;
          height: 48px;
          line-height: 22px;
          text-align: center;
          font-size: 16px;
          font-weight: bold;
          color: rgb(255, 255, 255);
        }

        h3 {
          font-size: 20px;
          line-height: 28px;
        }
      }
    }
  }
}
</style>
