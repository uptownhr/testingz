var app = require('express')(),
  mongoose = require('mongoose'),
  config = require('./config')


mongoose.connect(config.mongodb)
mongoose.connection.on('error', function(){
  console.log('Mongodb connection error')
  process.exit(1)
})

app.listen(config.port, function(e){
  console.log('listening on', config.port)
})

module.exports = app