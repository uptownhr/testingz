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
      ctx.flash('errors', info.message);
      return ctx.redirect('/auth/login');
    }

    ctx.flash('success', { msg: 'Success! You are logged in.' });
    ctx.redirect('/')
    ctx.session.wtf = 'wtf'
    await ctx.logIn(user)
  })(ctx, next);
})

router.get('/register', function (req, res) {
  res.render('register', {
    query: req.query
  })
})

router.get('/logout', async (ctx, next) => {
  ctx.logout()
  ctx.redirect('/')
})

router.post('/register', function (req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 6 characters long').len(6);

  const errors = req.validationErrors();
  const body = req.body

  if (errors) {
    req.flash('errors', errors);
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

  User.findOne({ email: body.email }).exec()
    .then((existingUser) => {
      if (existingUser) {

        req.flash('errors', { msg: 'Account with that email address already exists.' });
        return res.redirect('/auth/register')
      }

      return user.save()
    })
    .then(registeredUser => req.logIn(registeredUser, (err) => {
      if (err) return next(err)
      res.redirect('/')
    }))
    .catch((err) => {
      if (err) return next(err)
    })
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
