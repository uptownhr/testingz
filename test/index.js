var app = require('../index.js')

before(done => {
  setTimeout(done, 500)


})

after(done => {
  app.server.close()
  done()
})