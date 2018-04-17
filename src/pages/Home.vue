<template>
<div class="home-view">
  <div class="list">
    <div class="info">
      {{$t('list.totalMarketCap')}}:
      <span v-if="!loading">{{totalMarketCap}}</span> /
      {{$t('list.btcDominance')}}:
      <span v-if="!loading">{{global.bitcoin_percentage_of_market_cap}}%</span> /
      {{$t('list.updateTime')}}：
      <span v-if="!loading">{{ lastUpdated | timeFormat(locale) }}</span>
    </div>
    <table class="table" id="products">
      <tbody>
        <tr class="headorder">
          <th class="h-rank f-left">{{$t('list.rank')}}</th>
          <th class="h-name f-left">{{$t('list.symbol')}}</th>
          <th class="h-price f-left">{{$t('list.price')}}
            <select v-model="selectedUnit" @change="setUnit">
              <option value="usd">$</option>
              <option value="cny">¥</option>
              <option value="btc">Bits</option>
            </select>
          </th>
          <th class="h-change f-left">{{$t('list.change')}}
            <select v-model="selectedChange" @change="setChange">
              <option value="24h">24H</option>
              <option value="1h">1H</option>
              <option value="7d">7D</option>
            </select>
          </th>
        </tr>
        <div v-if="showError"></div>
        <tr v-if="!loading" v-for="item in tickers" class="item">
          <td><span>{{item.rank}}</span></td>
          <td><span>{{item.symbol}}</span></td>
          <td class="align-right"><span>{{item[`price_${selectedUnit}`] | format(selectedUnit)}}</span></td>
          <td class="align-right"><span v-bind:class="{'up': item[`percent_change_${selectedChange}`] >= 0, 'down': item[`percent_change_${selectedChange}`] < 0}" class="change">{{item[`percent_change_${selectedChange}`] | format}}%</span></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script>
import mixin from '@/mixin.js'
import numeral from 'numeral'
// import axios from 'axios'
import Timeago from 'timeago.js'
const timeAgo = new Timeago()
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
      loading: true
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
      let wsUrl = window.location.hostname === 'localhost'
        ? 'ws://localhost:8443'
        : 'wss://coin.bch123.org:8443'
      const ws = new WebSocket(wsUrl)
      this.$bar.start()
      ws.onopen = (event) => {
        console.log('websocket on open')
      }
      ws.onmessage = (message) => {
        console.log('ws get msg')
        this.loading = false
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
    }
  },
  filters: {
    format (value, unit) {
      if (unit === 'btc') return numeral(value * 10 ** 6).format('0,000,000.00')
      return numeral(value).format('0,0.00')
    },
    timeFormat (time, locale) {
      // return timeAgo.format(new Date(time * 1000), locale)
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
  }
}
</script>

  <style>
  .home-view {
    margin: 0 auto;
    min-height: 500px;
  }
  .list .item {
    position: relative;
    height: 2rem;
    line-height: 2rem;
  }
  .list .item .link {
    color: #333;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-decoration: none;
    padding: 0 .1rem;
  }
  .list .item .link:visited {
    color: #9a9a9a;
  }
  .list .link .placeholder {
    background: red;
    width: 100%;
  }
  .list .item:nth-child(2n+1) {
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
  .table {
    // width: 100%;
		white-space: nowrap;
  }
  .table th {
  }
  .table td, .table th {
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
  .h-name {
    width: .55rem;
  }
  .h-change {
    width: .7rem;
  }
  .h-price {
    width: 1rem;
  }
</style>
