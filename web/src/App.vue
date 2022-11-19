<template>
  <router-view></router-view>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  methods: {
    ...mapMutations(['setinfo', 'setgoods'])
  },
  // 在vue.app的created生命周期中发送get请求获取账号信息
  async created() {
    const token = localStorage.getItem('token')
    if (token) {
      const { data } = await this.$http({
        method: 'GET',
        url: '/getinfo',
        headers: {
          Authorization: localStorage.getItem('token')
        },
        params: {
          token
        }
      })
      this.setinfo(data.info)
    }
  }
}
</script>
