var app = require('../index.js'),
  models = require('../models'),
  User = models.User

before(done => {
  setTimeout(User.findOne({role:'admin'}, function(err, user){
    user.providers.push({
      name: 'mock_provider'
    })

    user.save( (err) => done() )
  }), 500)

})

after(done => {
  app.server.close()
  done()
})