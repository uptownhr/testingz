const router = require('express').Router()

router.get('/', function(req,res){
  res.render('index')
})

router.get('/test', function(req, res){
  res.render('ghost')
})

module.exports = router