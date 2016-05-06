'use strict'

const Koa = require('koa'),
  Pug = require('koa-pug'),
  serve = require('koa-static'),
  mongoose = require('mongoose'),
  config = require('./config'),
  path = require('path'),
  passport = require('koa-passport'),
  bodyParser = require('koa-bodyparser'),
  session = require('koa-generic-session'),
  redisStore = require('koa-redis'),
  flash = require('express-flash'),
  expressValidator = require('express-validator'),
  cookieParser = require('cookie-parser'),
  moment = require('moment')

require('./config/seed.js')

const app = new Koa()

/*connect to mongodb */
mongoose.connect(config.mongodb)

mongoose.connection.on('error', () => {
  console.log('Mongodb connection error')
  process.exit(1)
})

mongoose.connection.on('connected', () => {
  // listen on config port, default 3000
  app.server = app.listen(config.port, function (e) {
    console.log('listening on', config.port, config.mongodb)
  })
})

/* configure application */
const pug = new Pug({
  viewPath: './views',
  debug: false,
  compileDebug: false,
  pretty: true,
  locals: {
    moment
  },
  basedir: './views',
  helperPath: [],
  app: app
})

const convert = require('koa-convert')

//specify public static directory
app.use(serve('public'))
app.use(bodyParser())


app.keys = ['secret']
app.use(convert(session({
  resave: true,
  saveUninitialized: true,
  secret: config.secret,
  store: redisStore({ url: config.redis })
})))
app.use(passport.initialize())
app.use(passport.session())

app.use((ctx, next) => {
  pug.locals.user = ctx.req.user
  next()
})

app.use((req, res, next) => {
  if (!req.user || !req.user.askEmail || req.user.email || req.path == '/askEmail') return next()

  console.log('redirecting for email')
  return res.redirect('/askEmail')
})

/*app.get('/askEmail', (req, res) => {
  res.render('askEmail')
})

app.post('/askEmail', (req, res) => {
  console.log('POST EMAIL')
  req.assert('email', 'Email is not valid').isEmail();

  var errors = req.validationErrors();

  if (errors) {
    console.log('error', errors)
    req.flash('errors', errors);
    return res.redirect('/askEmail');
  }

  const body = req.body

  req.user.askEmail = false
  req.user.email = body.email
  req.user.save((err, saved) => {
    console.log(err, saved)
    res.redirect('/')
  })
})*/

module.exports = app
