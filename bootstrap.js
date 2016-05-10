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
  flash = require('koa-flash-simple'),
  cookieParser = require('cookie-parser'),
  moment = require('moment'),
  _ = require('lodash')

require('./config/seed.js')

const app = new Koa()

var { Validator, FileValidator } = require('koa-validate')
Validator.prototype.addError = function (tip) {
  this.goOn = false;
  if (this.value && this instanceof FileValidator) {
    this.value.goOn = false;
  }

  if (!this.context.errors) {
    this.context.errors = [];
  }

  this.context.errors.push(tip);
}

require('koa-validate')(app)

/*connect to mongodb */
mongoose.connect(config.mongodb)

mongoose.connection.on('error', () => {
  console.log('Mongodb connection error')
  process.exit(1)
})

mongoose.connection.on('connected', () => {
  console.log('Mongodb connected')
})

// listen on config port, default 3000
app.server = app.listen(config.port, function (e) {
  console.log('listening on', config.port, config.mongodb)
})

/* configure application */
const pug = new Pug({
  viewPath: './views',
  debug: true,
  compileDebug: true,
  pretty: true,
  locals: {
    moment,
    messages: {}
  },
  basedir: './views',
  helperPath: [],
  noCache: true
})
pug.options.noCache = true
pug.use(app)
const convert = require('koa-convert')

//specify public static directory
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = { msg: err.message }
    ctx.app.emit('error', err, this)
  }
})
app.use(convert(serve('public')))
app.use(bodyParser())

app.keys = [config.secret]
app.use(convert(session({
  resave: true,
  saveUninitialized: true,
  secret: config.secret,
  store: redisStore({ url: config.redis })
})))
app.use(passport.initialize())
app.use(passport.session())

/* flash middleware */
app.use(async (ctx, next) => {
  let data = ctx.session.flash || {}

  delete ctx.session.flash

  ctx.flash = (type, val) => {
    console.log('flash received', type, val)
    ctx.session.flash = { [type]: val }
  }

  ctx.messages = () => data

  await next()
})

/* add flash messages */
app.use(async (ctx, next) => {
  pug.locals.messages = ctx.messages()

  await next()
})

/* add logged in user to locals */
app.use(async (ctx, next) => {
  pug.locals.user = ctx.req.user
  await next()
})

/*
app.use(async (req, res, next) => {
  console.log('wtf')
  if (!req.user || !req.user.askEmail || req.user.email || req.path == '/askEmail') return next()

  console.log('redirecting for email')
  return res.redirect('/askEmail')
})*/

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
