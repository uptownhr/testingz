"use strict"
const app = require('./bootstrap'),
  controllers = require('./controllers'),
  models = require('./models'),
  passport = require('./config/passport')

app.use('/', controllers.Home)
app.use('/auth', controllers.Auth)
app.use('/admin', passport.isAuthenticated, passport.isAdmin, controllers.Admin)


app.get('/test', (req,res) => {
  res.send(req.query)
})