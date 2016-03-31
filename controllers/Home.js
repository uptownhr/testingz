const router = require('express').Router();
var Entry = require('../models/Entry');

router.get('/', function(req,res){
  res.render('index')
})

router.get('/blog/post/:_id', function(req, res){
  var id = req.params._id
  Entry.findOne({_id: id}, function(err, entry){
    res.render('post',{
      post: entry
    })
  })
})

module.exports = router