<template>
  <div class="contain">
    <div class="left">
      <img :src="'http://127.0.0.1/goods/' + src + '.png'" alt="">
    </div>
    <div class="right">
      <p id="p1">{{ title }}</p>
      <p id="p2"><em>¥</em> {{ price }}</p>
      <span @click="buy">购买</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: ['src', 'title', 'price'],
  data: function() {
    return {

    }
  },
  computed: {
    ...mapState(['myinfo'])
  },
  methods: {
    buy() {
      // 判断是否处于登录状态, 若未登录则应该先登录再购买
      if (this.myinfo === null) {
        this.$router.push('/login')
      } else {
        this.$router.push('/detail/' + this.src)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.contain {
  border: 1px solid rgb(255, 255, 255);
  max-width: 31.33%;
  min-width: max(31.33%, 340px);
  background-color: #fff;
  border-radius: 10px;
  display: flex;
  padding: 11px;
  height: 172px;
  transition: .7s;

  &:hover {
    border: 1px solid rgb(255, 145, 94);
  }

  .left {
    flex: 1;
    display: flex;
    align-items: center;
    overflow: hidden;

    img {
      width: 150px;
      border-radius: 10px;
    }
  }

  .right {
    flex: 1;
    position: relative;

    span {
      position: absolute;
      font-size: 16px;
      line-height: 30px;
      right: 0;
      bottom: 0;
      height: 30px;
      border-top-left-radius: 15px;
      border-bottom-left-radius: 15px;
      background: linear-gradient(to right, rgb(253, 200, 0), rgb(254, 149, 6));
      letter-spacing: 5px;
      padding: 0 5px 0 10px;

      &:hover {
        cursor: pointer;
      }
    }

    p {
      position: absolute;
    }

    #p1 {
      top: 0;
      line-height: 22px;
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
      text-align: justify;
    }

    #p2 {
      em {
        font-style: normal;
        font-size: 14px;
      }

      color: #ff5000;
      bottom: 0;
      font-size: 22px;
    }
  }
}
</style>
