const Koa = require('koa')
const Router = require('koa-router')
const statics = require('koa-static')
const axios = require('axios')
const path = require('path')
const history = require('koa2-connect-history-api-fallback')
// const Binance = require('binance-api-node')
// const client = Binance.default()
// client.time().then(time => console.log(time))
let cloudData
if (process.env.LEANCLOUD_APP_ID) {
  const AV = require('leanengine')
  cloudData = AV.Object.createWithoutData('Data', '5a5c5c71ac502e0042f62b60')
}

const app = new Koa()
const router = new Router()

// router.get('/api/allprices', async (ctx, next) => {
  // ctx.body = await client.prices()
// })

let dataCache
const fetchCoinmarketcap = () => {
  return axios
    .all([
      axios.get('https://api.coinmarketcap.com/v1/ticker/?convert=CNY&limit=50'),
      axios.get('https://api.coinmarketcap.com/v1/global/?convert=CNY')
    ])
    .then(axios.spread((res1, res2) => {
      dataCache = {
        tickers: res1.data,
        global: res2.data
      }

      // let data = new Data()
      if (process.env.LEANCLOUD_APP_ID) {
        cloudData.set('content', dataCache)
        cloudData.save().then((res) => {
          console.log('save to cloud: ', res.id)
        }).catch((error) => {console.log(error)})
      }
    }))
    .catch((error) => {console.log(error)})
}

fetchCoinmarketcap()
setInterval(fetchCoinmarketcap, 1000 * 60 * 3)

router.get('/api/coinmarketcap', async (ctx, next) => {
  ctx.body = dataCache || await fetchCoinmarketcap()
})

app
  .use(router.routes())
  .use(router.allowedMethods())
  .use(history({whkteList: ['/api']}))
  .use(statics(path.join(__dirname, '../dist')))

module.exports = app
