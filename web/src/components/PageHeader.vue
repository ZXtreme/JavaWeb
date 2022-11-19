<template>
  <header>
    <p v-if="myinfo === null">购物之家欢迎您! 请<router-link to="/login">登录</router-link>
    </p>
    <p v-else>
      <slot></slot> 用户 <em>{{ myinfo.username }}</em> ,购物之家欢迎您! <span @click="logout">退出登录</span>
    </p>
  </header>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState(['myinfo'])
  },
  methods: {
    ...mapMutations(['setinfo']),
    logout() {
      this.setinfo(null)
      localStorage.removeItem('token')
      localStorage.removeItem('id')
    }
  }
}
</script>

<style lang="less" scoped>
header {
  background-color: rgb(227, 228, 229);

  p {
    padding: 7px 15px;
    font-size: 13px;
    line-height: 19px;

    a {
      color: #db636b;

      &:hover {
        color: #c81623;
        cursor: pointer;
      }
    }

    em {
      color: #c81623;
      font-style: normal;
    }

    span {
      color: #c81623;

      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
