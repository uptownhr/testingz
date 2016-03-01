const app = require('./bootstrap'),
  controllers = require('./controllers'),
  models = require('./models')

app.use('/', controllers.Home)
app.use('/admin', controllers.Admin)