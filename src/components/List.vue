<template>
<div class="home-view">
  <div class="list">
    <div class="info">
      更新时间：
      <span v-if="!loading">{{ list[0].last_updated | timeFormat }}</span>
    </div>
    <table class="table" id="products">
      <tbody>
        <tr class="headorder">
          <th class="h-rank f-left">排名</th>
          <th class="h-name f-left">名称</th>
          <th class="h-price f-left">最新价 ¥</th>
          <th class="h-change f-left">24涨跌</th>
        </tr>
        <tr v-for="item in list || skeletonList" class="item">
          <td v-if="!loading"><span>{{item.rank}}</span></td>
          <td v-if="!loading"><span>{{item.symbol}}</span></td>
          <td v-if="!loading" class="align-right"><span>{{item.price_cny | format}}</span></td>
          <td v-if="!loading" class="align-right"><span v-bind:class="{'up': item.percent_change_24h >= 0, 'down': item.percent_change_24h < 0}" class="change">{{item.percent_change_24h | format}}%</span></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script>
import mixin from '@/mixin.js'
import numeral from 'numeral'
export default {
  name: 'List',
  mixins: [mixin],
  data () {
    return {
      list: null,
      loading: true
    }
  },
  methods: {
  },
  computed: {
    skeletonList () {
      const list = []
      list.length = 25
      return list
    }
  },
  filters: {
    format (value) {
      if (!value) return ''
      return numeral(value).format('0,0.00')
      // return (+value).toFixed(parseInt(value) / 100 < 1 ? 2 : 0)
    },
    timeFormat (time) {
      return (new Date(time * 1000)).toLocaleString()
    }
  },
  created () {
    if (this.$route.name !== 'Post') {
      this.$bar.start()
      fetch('/api/coinmarketcap').then(res => res.json()).then(data => {
        this.loading = false
        this.list = data
        this.$bar.finish()
      })
      // fetch('https://bird.ioliu.cn/v1/?url=https://www.binance.com/api/v1/ticker/allPrices').then(res => res.json()).then(data => {
      // this.loading = false
      // this.list = data
      // this.$bar.finish()
      // })
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
    display: inline-block;
  }
  .h-name, .h-change {
    width: .55rem;
  }
  .h-price {
    width: 1rem;
  }
</style>
