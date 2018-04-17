const Koa = require('koa'),
  Router = require('koa-router'),
  fs = require('fs'),
  statics = require('koa-static'),
  axios = require('axios'),
  path = require('path'),
  history = require('koa2-connect-history-api-fallback'),
  websockify = require('koa-websocket')
// const Binance = require('binance-api-node')
// const client = Binance.default()
// client.time().then(time => console.log(time))
let cloudData
if (process.env.LEANCLOUD_APP_ID) {
  const AV = require('leanengine')
  cloudData = AV.Object.createWithoutData('Data', '5a5c5c71ac502e0042f62b60')
}

const isDevEnv = process.env.NODE_ENV === 'development'
const httpsOptions = !isDevEnv && {
  email: 'ibeceo@gmail.com',
  agreeTos: true,
  key: fs.readFileSync(path.resolve(__dirname, '../privkey.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../fullchain.pem')),
}
const app = new Koa()
const socket = isDevEnv
  ? websockify(app)
  : // : websockify(app, {}, le.httpsOptions)
    websockify(app, {}, httpsOptions)
const router = new Router()
const ws = new Router()

// router.get('/api/allprices', async (ctx, next) => {
// ctx.body = await client.prices()
// })

let dataCache
const fetchCoinmarketcap = () => {
  return axios
    .all([
      axios.get(
        'https://api.coinmarketcap.com/v1/ticker/?convert=CNY&limit=50',
      ),
      axios.get('https://api.coinmarketcap.com/v1/global/?convert=CNY'),
    ])
    .then(
      axios.spread((res1, res2) => {
        dataCache = {
          tickers: res1.data,
          global: res2.data,
        }

        // let data = new Data()
        if (process.env.LEANCLOUD_APP_ID) {
          cloudData.set('content', dataCache)
          cloudData
            .save()
            .then(res => {
              console.log('save to cloud: ', res.id)
            })
            .catch(error => {
              console.log(error)
            })
        }
      }),
    )
    .catch(error => {
      console.log(error)
    })
}

fetchCoinmarketcap()
setInterval(fetchCoinmarketcap, 1000 * 60 * 3)

router.get('/api/coinmarketcap', async (ctx, next) => {
  ctx.body = dataCache || (await fetchCoinmarketcap())
})

ws.all('/*', async (ctx, next) => {
  console.log('connected websocket')
  ctx.websocket.send(JSON.stringify(dataCache))
  setInterval(() => {
    if (ctx.websocket.readyState === 1) {
      ctx.websocket.send(JSON.stringify(dataCache))
    } else {
      console.log('send failed, readyState: ', ctx.websocket.readyState)
    }
  }, 1000 * 60 * 3.2)
})

app
  .use(router.routes())
  .use(router.allowedMethods())
  .use(history({ whkteList: ['/api'] }))
  .use(statics(path.join(__dirname, '../dist')))

app.ws.use(ws.routes()).use(ws.allowedMethods())

function sleep(ms = 0) {
  return new Promise((resolve, reject) => setTimeout(resolve, ms))
}

module.exports = app
