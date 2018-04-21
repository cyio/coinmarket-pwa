// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router.js'
import VueI18n from 'vue-i18n'

Vue.config.productionTip = false
Vue.use(VueI18n)

const shared = {
  isZh: /zh/.test(window.navigator.language),
  loading: true,
}

const translations = {
  zh: {
    list: {
      updateTime: '更新时间',
      rank: '排名',
      symbol: '名称',
      price: '最新价',
      change: '涨跌',
      marketCap: '市值',
      error: '请求超时，请稍后刷新重试',
      totalMarketCap: '总市值',
      btcDominance: 'BTC占比',
      instantFilter: '即时过滤',
      supportDeveloper: '支持开发者',
    },
  },
  en: {
    list: {
      updateTime: 'last update',
      rank: 'Rank',
      symbol: 'Symbol',
      price: 'Price',
      change: 'Change',
      marketCap: 'Market Cap',
      error: 'Timeout, please retry',
      totalMarketCap: 'Market Cap',
      btcDominance: 'BTC Dominance',
      instantFilter: 'instant filter symbol',
      supportDeveloper: 'Support Developer',
    },
  },
}

const i18n = new VueI18n({
  locale: shared.isZh ? 'zh' : 'en',
  messages: translations,
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
    shared,
  },
  router,
  i18n,
  template: '<App/>',
  components: { App },
})
