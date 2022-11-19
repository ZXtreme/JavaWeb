<template>
  <div class="container">
    <PageHeader></PageHeader>

    <nav>
      <img src="../assets/logo.png" alt="">
      <div class="search">
        <input type="text" v-model="searchText" />
        <span @click="searchGds">搜索</span>
      </div>
    </nav>

    <article>
      <div class="left">
        <ul>
          <li>
            <span style="background-position:0px 0px"></span>品类齐全，轻松购物
          </li>
          <li>
            <span style="background-position:-41px 0px"></span>多仓直发，极速配送
          </li>
          <li>
            <span style="background-position:-82px 0px"></span>正品行货，精致服务
          </li>
          <li>
            <span style="background-position:-123px 0px"></span>天天低价，畅选无忧
          </li>
        </ul>
      </div>
      <div class="middle">
        <div class="block">
          <el-carousel trigger="click" height="409px">
            <el-carousel-item v-for="item in 6" :key="item">
              <img class="small" :src="require('../assets/slider' + (item) + '.jpg')" />
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <div class="right">
        <ul>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </article>

    <div class="goods">
      <AboutGoods id="gd" v-for="item in filterGoods" :key="item.goodsname" :src="item.goodsname"
        :title="item.description" :price="item.price"></AboutGoods>
    </div>
    <footer>
      <ul class="footer-1">
        <li>
          <ul class="subul1">
            <li>购物指南</li>
            <li><a href="javascript:;">购物流程</a></li>
            <li><a href="javascript:;">会员介绍</a></li>
            <li><a href="javascript:;">生活旅行</a></li>
            <li><a href="javascript:;">常见问题</a></li>
            <li><a href="javascript:;">大家电</a></li>
            <li><a href="javascript:;">联系客服</a></li>
          </ul>
        </li>
        <li>
          <ul class="subul1">
            <li>配送方式</li>
            <li><a href="javascript:;">上门自提</a></li>
            <li><a href="javascript:;">211限时达</a></li>
            <li><a href="javascript:;">配送服务查询</a></li>
            <li><a href="javascript:;">配送费收取标准</a></li>
            <li><a href="javascript:;">海外配送</a></li>
          </ul>
        </li>
        <li>
          <ul class="subul1">
            <li>支付方式</li>
            <li><a href="javascript:;">货到付款</a></li>
            <li><a href="javascript:;">在线支付</a></li>
            <li><a href="javascript:;">分期付款</a></li>
            <li><a href="javascript:;">公司转账</a></li>
          </ul>
        </li>
        <li>
          <ul class="subul1">
            <li>售后服务</li>
            <li><a href="javascript:;">售后政策</a></li>
            <li><a href="javascript:;">价格保护</a></li>
            <li><a href="javascript:;">退款说明</a></li>
            <li><a href="javascript:;">返修/退换货</a></li>
            <li><a href="javascript:;">取消订单</a></li>
          </ul>
        </li>
      </ul>
      <div class="footer-div">
        <ul class="footer-2">
          <li><a href="javascript:;">关于我们</a></li>
          <li><a href="javascript:;">联系我们</a></li>
          <li><a href="javascript:;">联系客服</a></li>
          <li><a href="javascript:;">合作招商</a></li>
          <li><a href="javascript:;">商家帮助</a></li>
          <li><a href="javascript:;">营销中心</a></li>
          <li><a href="javascript:;">手机购物</a></li>
          <li><a href="javascript:;">友情链接</a></li>
          <li><a href="javascript:;">销售联盟</a></li>
          <li><a href="javascript:;">购物社区</a></li>
          <li><a href="javascript:;">风险监测</a></li>
          <li><a href="javascript:;">隐私政策</a></li>
          <li><a href="javascript:;">购物公益</a></li>
          <li><a href="javascript:;">English Site</a></li>
          <li><a href="javascript:;">Media & IR</a></li>
        </ul>
      </div>
    </footer>
  </div>
</template>

<script>
import AboutGoods from '../components/AboutGoods.vue'
import PageHeader from '../components/PageHeader.vue'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    AboutGoods,
    PageHeader
  },
  async created() {
    // 获取商品信息
    const { data } = await this.$http({
      headers: {
        Authorization: localStorage.getItem('token')
      },
      method: 'GET',
      url: '/getgoods'
    })
    this.setgoods(data.goods)
    this.filterGoods = data.goods
  },
  data() {
    return {
      searchText: '',
      filterGoods: null
    }
  },
  computed: {
    ...mapState(['myinfo', 'goods'])
  },
  methods: {
    ...mapMutations(['setgoods']),
    searchGds() {
      // filter函数筛选商品
      this.filterGoods = this.goods.filter(val => val.description.indexOf(this.searchText) !== -1)
      const ele = document.querySelector('.goods')

      // 滚动条自动跳转到商品处, 优化交互效果
      window.scrollTo({
        top: ele.offsetTop,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  background-color: rgb(244, 244, 244);

  nav {
    background-color: #fff;
    height: 140px;
    padding: 20px 20%;
    display: flex;
    align-items: center;

    img {
      width: 20%;
      max-width: 100px;
    }

    .search {
      width: 70%;
      margin-left: 10%;

      input {
        height: 36px;
        width: 80%;
        vertical-align: middle;
        outline: none;
        border: 2px solid #b1191a;
        padding: 0 5px;
      }

      span {
        display: inline-block;
        height: 36px;
        width: 20%;
        vertical-align: middle;
        background-color: rgb(247, 247, 247);
        border: 1.5px solid #dfdfdf;
        border-left: 0;
        color: #b1191a;
        text-align: center;
        line-height: 33px;

        &:hover {
          cursor: pointer;
        }
      }
    }
  }

  article {
    margin: 12px 80px;
    display: flex;

    .left {
      flex: 1;

      ul {
        flex-direction: column;

        li {
          span {
            background-image: url(../assets/sprite.png);
            display: inline-block;
            width: 38px;
            height: 43px;
            vertical-align: middle;
          }

          width: 100%;
          height: 105px;
          line-height: 105px;
          font-size: 18px;
          font-weight: 700;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #444;
        }
      }
    }

    .middle {
      flex: 4;
      max-width: 590px;

      .block {
        margin: 10px 10px 0;
      }

      .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 150px;
        margin: 0;
      }

      .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
      }

      .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
      }
    }

    .right {
      flex: 1;

      ul {
        li {
          width: 100%;
          height: 130px;
          background-image: url(../assets/rotation_right_1.png);
          background-size: 100% 100%;
          margin-top: 10px;

          &:nth-child(1) {
            background-image: url(../assets/rotation_right_2.png);
          }

          &:nth-child(2) {
            background-image: url(../assets/rotation_right_3.png);
          }
        }
      }
    }
  }

  .goods {
    display: flex;
    flex-wrap: wrap;
    margin: 20px 80px;
    justify-content: center;
    align-items: center;

    #gd {
      margin: 10px 1% 0;
    }
  }

  footer {
    .footer-1 {
      border-top: 1px solid #dedede;
      padding: 20px 0 0 15%;
      display: flex;

      &>li {
        flex: 1;
        float: left;
      }

      .subul1 {
        li {
          color: #666;
          line-height: 22px;
          font-size: 12px;

          &:first-child {
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 5px;
          }

          a {
            color: #666;

            &:hover {
              color: rgb(227, 51, 51);
            }
          }
        }
      }
    }

    .footer-div {
      margin-top: 20px;
      border-top: 1px solid #dedede;
      padding-top: 20px;
      text-align: center;
      padding-bottom: 50px;

      .footer-2 {
        display: inline-block;

        li {
          float: left;
          color: #666;
          font-size: 12px;
          padding-left: 7px;

          &:nth-child(n+2)::before {
            content: "|";
            padding-right: 7px;
          }

          a {
            color: #666;

            &:hover {
              color: rgb(227, 51, 51);
            }
          }
        }
      }
    }
  }
}
</style>
