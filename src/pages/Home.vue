<template lang="pug">
.home-view
	.info
		| {{$t('list.totalMarketCap')}}:
		span(v-if='!loading') {{totalMarketCap}} /  {{$t('list.btcDominance')}}:
		span(v-if='!loading') {{global.bitcoin_percentage_of_market_cap}}% / {{$t('list.updateTime')}}：
		span(v-if='!loading') {{ lastUpdated | timeFormat(locale) }}
	.filter
		input(ref='search', type='email', v-model='keyword', :placeholder="$t('list.instantFilter')")
		#checkout(:data-storename="$t('list.supportDeveloper')", data-storeicon='https://bch123.org/static/img/icons/favicon.png', data-key='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNWQyZDhhYjQtNTI5Ni00NjZhLThhZWQtY2EwZjhiMDc5NDZiIiwiaWF0IjoxNTIzODY1ODg0LCJleHAiOjE1NTU0MjM0ODR9.4W9aJnQF_HU__ueOjedpF56SsTvpe8_nkBoLd8xqDXo', :data-amount='customAmount')
	table#products.coin-table
		tbody
			tr.headorder
				th.h-rank.f-left {{$t('list.rank')}}
				th.h-name.f-left {{$t('list.symbol')}}
				th.h-price.f-left
					| {{$t('list.price')}}
					select(v-model='selectedUnit', @change='setUnit')
						option(value='usd') $
						option(value='cny') ¥
						option(value='btc') Bits
				th.h-change.f-left
					| {{$t('list.change')}}
					select(v-model='selectedChange', @change='setChange')
						option(value='24h') 24H
						option(value='1h') 1H
						option(value='7d') 7D
			div(v-if='showError')
			tr.item(v-if='!loading', v-for='item in filterTickers')
				td
					span {{item.rank}}
				td
					span {{item.symbol}}
				td.align-right
					span {{item[`price_${selectedUnit}`] | format(selectedUnit)}}
				td.align-right
					span.change(v-bind:class="{'up': item[`percent_change_${selectedChange}`] >= 0, 'down': item[`percent_change_${selectedChange}`] < 0}") {{item[`percent_change_${selectedChange}`] | format}}%
</template>

<script>
import mixin from '@/mixin.js'
import numeral from 'numeral'
// import axios from 'axios'
import Timeago from 'timeago.js'
import MobileDetect from 'mobile-detect'
import { isLocalhost } from '@/utils'
const timeAgo = new Timeago()
const md = new MobileDetect(window.navigator.userAgent)
export default {
  name: 'List',
  mixins: [mixin],
  data () {
    return {
      tickers: null,
      global: null,
      selectedUnit: this.$root.$data.shared.isZh ? 'cny' : 'usd',
      selectedChange: '24h',
      lastUpdated: new Date(),
      showError: false,
      keyword: '',
      customAmount: 0.1,
    }
  },
  methods: {
    setData (data) {
      this.tickers = data.tickers
      this.global = data.global
    },
    setUnit () {
      localStorage.setItem('unit', this.selectedUnit)
    },
    setChange () {
      localStorage.setItem('change', this.selectedChange)
    },
    connect () {
      let wsUrl = isLocalhost
        ? `ws://${window.location.hostname}:8443`
        : 'wss://coin.bch123.org:8443'
      const ws = new WebSocket(wsUrl)
      this.showLoading()
      ws.onopen = (event) => {
        console.log('websocket on open')
      }
      ws.onmessage = (message) => {
        console.log('ws get msg')
        this.hideLoading()
        this.setData(JSON.parse(message.data))
        this.lastUpdated = new Date()
      }
      ws.onclose = (e) => {
        console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason)
        setTimeout(() => {
          this.connect()
        }, 1000)
      }
      ws.onerror = (err) => {
        console.error('Socket encountered error: ', err.message, 'Closing socket')
        ws.close()
      }
    }
  },
  computed: {
    locale () {
      return this.$root.$data.shared.isZh ? 'zh_CN' : 'en_US'
    },
    totalMarketCap () {
      const caps = {
        'cny': '¥' + numeral(this.global.total_market_cap_cny / (10 ** 8)).format('0,000.00') + '亿',
        'usd': '$' + numeral(this.global.total_market_cap_usd / (10 ** 9)).format('0,000.00') + 'B'
      }
      if (/cny|usd/.test(this.selectedUnit)) {
        return caps[this.selectedUnit]
      } else {
        return caps[this.$root.$data.shared.isZh ? 'cny' : 'usd']
      }
    },
    filterTickers () {
      return this.tickers && this.tickers.filter(ticker => ticker.symbol.includes(this.keyword.trim().toUpperCase()))
    }
  },
  filters: {
    format (value, unit) {
      if (unit === 'btc') return numeral(value * 10 ** 6).format('0,000,000.00')
      return numeral(value).format('0,0.00')
    },
    timeFormat (time, locale) {
      return timeAgo.format(time, locale)
    }
  },
  created () {
    let unit = localStorage.getItem('unit')
    let change = localStorage.getItem('change')
    if (unit) {
      this.selectedUnit = unit
    }
    if (change) {
      this.selectedChange = change
    }
    this.connect()
  },
  mounted () {
    if (!md.mobile()) {
      this.$refs.search.focus()
    }
  }
}
</script>

  <style scoped>
  .home-view {
    margin: 0 auto;
    min-height: 500px;
  }
  .item {
    position: relative;
    height: 2rem;
    line-height: 2rem;
  }
  .item .link {
    color: #333;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-decoration: none;
    padding: 0 .1rem;
  }
  .item .link:visited {
    color: #9a9a9a;
  }
  .link .placeholder {
    background: red;
    width: 100%;
  }
  .item:nth-child(2n+1) {
    background-color: #F5F5F5;
  }
  .headorder {
    background: #e0e9f3;
    height: 2rem;
  }
  .info {
		margin: .4rem;
    color: #a2a2a2;
    font-size: .9rem;
  }
  .info span {
    color: var(--theme)
  }
  .coin-table {
    white-space: nowrap;
  }
  .coin-table th {
  }
  .coin-table td, .coin-table th {
    text-indent: .5rem;
  }
  .align-right {
		text-align: right;
		transform: translateX(-10%);
  }
  .headorder .f-left {
    text-align: left;
  }
  .item td {
  }
  .up {
    color: green;
  }
  .down {
    color: red;
  }
  .change {
    width: .5rem;
  }
  .h-rank {
    width: 10px;
  }
  .h-name {
    width: .55rem;
  }
  .h-change {
    width: .7rem;
  }
  .h-price {
    width: 1rem;
  }
  .filter {
    padding: 2px 5px;
    display: flex;
    justify-content: space-between;
  }
  .filter input {
    border: 1px solid #ddd;
    padding: 2px 5px;
  }
  .filter input:focus {
    font-size: 16px;
    border-color: var(--theme);
  }
</style>
