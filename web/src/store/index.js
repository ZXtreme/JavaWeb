import Vue from 'vue'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Vuex)
Vue.use(ElementUI)

export default new Vuex.Store({
  state: {
    myinfo: null,
    goods: {}
  },
  getters: {
  },
  mutations: {
    setinfo(state, info) {
      state.myinfo = info
    },
    setgoods(state, goods) {
      state.goods = goods
    }
  },
  actions: {
  }
})
