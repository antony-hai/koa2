const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const mongoose = require('mongoose')
const session = require("koa-session2")
//  import routes
const index = require('./routes/index')
const user = require('./routes/user')
const admin = require('./routes/admin')
// import config
const config = require('./config')

// mongondb connect
mongoose.Promise = require('bluebird')
mongoose.connect(config.mongodb_url, { useMongoClient: true })
// error handler
onerror(app)

const MongoStore = require('./Store')
// middlewares
app.use(session({
  key: 'session',
  store: new MongoStore(),
}))
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())

app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views/pages', {
  extension: 'pug',
}))

// logger
app.use(async (ctx, next) => {
  ctx.state = {
    moment: require('moment')
  }
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(user.routes(), user.allowedMethods())
app.use(admin.routes(), admin.allowedMethods())

module.exports = app
