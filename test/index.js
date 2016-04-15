"use static"
var app = require('../index.js'),
  models = require('../models'),
  User = models.User
  seed = require('../config/seed')

before(done => {
  seed
    .then( addMockProvider )
    .then( done.bind(null,null) )
    .catch( done.bind(null,null) )

  /*setTimeout(User.findOne({role:'admin'}, function(err, user){


    user.save( (err) => done() )
  }), 500)*/

})

after(done => {
  app.server.close()
  done()
})

function addMockProvider(){
  return User.findOne({role: 'admin'}, function(err, user){
    user.providers.push({
      name: 'mock_provider'
    })

    return user.save()
  })
}