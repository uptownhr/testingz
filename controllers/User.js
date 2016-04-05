const router = require('express').Router(),
  User = require('../models/User');

router.get('/account', function(req,res){
  var user = req.user

  res.render('account', { user } )
})

module.exports = router
