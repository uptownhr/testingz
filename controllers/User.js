const router = require('express').Router(),
  User = require('../models/User');

router.get('/account', function(req,res){
  var user = req.user.profile;
 
  res.render('account', { query : {
    first_name: user.name.split(' ')[0],
    last_name: user.name.split(' ')[1],
    email: user.email
  }})
})

module.exports = router
