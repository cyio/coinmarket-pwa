<template>
<div class="home-view">
  <div class="list">
    <div class="info">
      {{$t('list.updateTime')}}：
      <span v-if="!loading">{{ list[0].last_updated | timeFormat }}</span>
    </div>
    <table class="table" id="products">
      <tbody>
        <tr class="headorder">
          <th class="h-rank f-left">{{$t('list.rank')}}</th>
          <th class="h-name f-left">{{$t('list.symbol')}}</th>
          <th class="h-price f-left">{{$t('list.price')}}
            <select v-model="selectedUnit" @change="setUnit">
              <option value="cny">¥</option>
              <option value="usd">$</option>
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
        <tr v-if="!loading" v-for="item in list" class="item">
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
import axios from 'axios'
import Timeago from 'timeago.js'
const timeAgo = new Timeago()
axios.defaults.timeout = 5000
export default {
  name: 'List',
  mixins: [mixin],
  data () {
    return {
      list: null,
      selectedUnit: 'cny',
      selectedChange: '24h',
      showError: false,
      loading: true
    }
  },
  methods: {
    setUnit () {
      localStorage.setItem('unit', this.selectedUnit)
    },
    setChange () {
      localStorage.setItem('change', this.selectedChange)
    }
  },
  computed: {
  },
  filters: {
    format (value, unit) {
      if (unit === 'btc') return numeral(value * 10 ** 6).format('0,000,000.00')
      return numeral(value).format('0,0.00')
    },
    timeFormat (time) {
      const locale = /zh/.test(window.navigator.language) ? 'zh_CN' : 'en_US'
      return timeAgo.format(new Date(time * 1000), locale)
    }
  },
  created () {
    const getCoinMarketCap = () => {
      this.$bar.start()
      return axios.get('/api/coinmarketcap')
        .then(res => {
          // console.log(res)
          this.list = res.data
          this.loading = false
          this.$bar.finish()
        })
    }
    getCoinMarketCap().catch(err => {
      console.log(err)
      // 请求失败后，再试一次
      getCoinMarketCap().catch(() => {
        this.showError = true
      })
    })
    let unit = localStorage.getItem('unit')
    let change = localStorage.getItem('change')
    if (unit) {
      this.selectedUnit = unit
    }
    if (change) {
      this.selectedChange = change
    }
  },
  mounted () {
  }
}
</script>

<style>
  .list .item {
    position: relative;
    height: .3rem;
    line-height: .3rem;
    padding: 5px;
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
    height: .25rem;
		font-size: .12rem;
  }
  .info {
    margin-left: .1rem;
    font-size: .12rem;
    padding: 2px;
    color: #a2a2a2;
  }
  .table {
    // width: 100%;
		white-space: nowrap;
  }
  .table th {
  }
  .table td, .table th {
    text-indent: .05rem;
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
