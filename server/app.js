const Koa = require('koa')
const Router = require('koa-router')
const statics = require('koa-static')
const axios = require('axios')
const cheerio = require('cheerio')
const path = require('path')
const url = require('url')
const request = require('request')
const history = require('koa2-connect-history-api-fallback')
const Binance = require('binance-api-node')
const client = Binance.default()
client.time().then(time => console.log(time))

const app = new Koa()
const router = new Router()

router.get('/api/allprices', async (ctx, next) => {
  ctx.body = await client.prices()
})

let dataCache
const fetchCoinmarketcap = () => {
  return axios
    .get('https://api.coinmarketcap.com/v1/ticker/?convert=CNY&limit=20')
    .then(res => (dataCache = res.data))
    .catch(err => console.log(err))
}
fetchCoinmarketcap()
setInterval(fetchCoinmarketcap, 7000)

router.get('/api/coinmarketcap', async (ctx, next) => {
  ctx.body = dataCache
})

app
  .use(router.routes())
  .use(router.allowedMethods())
  .use(history({whkteList: ['/api']}))
  .use(statics(path.join(__dirname, '../dist')))

module.exports = app
