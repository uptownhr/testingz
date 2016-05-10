const router = require('koa-router')({ prefix: '/auth' })

const config = require('../config'),
  User = require('../models/User'),
  queryString = require('querystring'),
  passport = require('koa-passport')

router.get('/login', async ctx => {
  ctx.render('login')
})

router.post('/login', async (ctx, next) => {
  ctx.checkBody('email', 'Email is not valid').isEmail()
  ctx.checkBody('password', 'Password must be at least 6 characters long').len(6)

  if (ctx.errors) {
    ctx.flash('errors', ctx.errors)
    return ctx.redirect('login')
  }

  await passport.authenticate('local', async function (user, info, status) {
    if (!user) {
      console.log(info)
      ctx.flash('errors', [info.message]);
      return ctx.redirect('/auth/login');
    }

    ctx.flash('success', ['Success! You are logged in.']);
    ctx.redirect('/')
    ctx.session.wtf = 'wtf'
    await ctx.logIn(user)
  })(ctx, next);
})

router.get('/register', async (ctx, next) => {
  ctx.render('register', {
    query: ctx.req.query || {}
  })
})

router.get('/logout', async (ctx, next) => {
  ctx.logout()
  ctx.redirect('/')
})

router.post('/register', async (ctx, next) => {
  ctx.checkBody('email', 'Email is not valid').isEmail()
  ctx.checkBody('password', 'Password must be at least 6 characters long').len(6)

  const body = ctx.request.body

  if (ctx.errors) {
    ctx.flash('errors', errors);
    delete body.password

    return res.redirect('/auth/register?' + queryString.stringify(body));
  }

  const user = new User({
    email: body.email,
    password: body.password,
    profile: {
      name: body.first_name + ' ' + body.last_name
    }
  })

  const existingUser = await User.findOne({ email: body.email })

  if (existingUser) {
    ctx.flash('errors', ['Account with that email address already exists.']);
    return ctx.redirect('/auth/register')
  }

  const saved = await user.save()
  await ctx.logIn(saved)
  ctx.flash('success', ['Successfully registered'])
  ctx.redirect('/')
})

router.get('/o/:provider', function (req, res, next) {
  const provider = req.params.provider
  if (config.social.hasOwnProperty(provider)) {
    return passport.authenticate(provider)(req, res, next)
  } else {
    res.redirect('/');
  }
})

router.get('/o/:provider/callback', function (req, res, next) {
  const provider = req.params.provider

  if (config.social.hasOwnProperty(provider)) {
    return passport.authenticate(provider, { failureRedirect: '/auth/login' })(req, res, next);
  } else {
    res.redirect('/');
  }
}, function (req, res) {

  res.redirect(req.session.returnTo || '/')
})

module.exports = router
