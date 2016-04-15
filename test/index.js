var app = require('../index.js'),
  models = require('../models'),
  User = models.User

before(done => {
  //setTimeout(done, 500)

  User.findOne({role:'admin'}, function(err, user){
    user.providers.push({
      name: 'mock_provider'
    })

    user.save( (err) => done() )
  })

})

after(done => {
  app.server.close()
  done()
})