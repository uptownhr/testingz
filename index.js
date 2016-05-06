'use strict'

/*const app = require('./bootstrap'),
  controllers = require('./controllers'),
  models = require('./models'),
  passport = require('./config/passport')*/

var Koa = require('koa');
var app = new Koa()
var router = require('koa-router')();

router.get('/', function (ctx, next) {});

//app.use('/', controllers.Home.routes())
app.use('/', router.routes())
/*
app.use('/blog', controllers.Post)
app.use('/auth', controllers.Auth)
app.use('/user', passport.isAuthenticated, controllers.User)
app.use('/admin', passport.isAuthenticated, passport.isAdmin, controllers.Admin)
*/

module.exports = app
