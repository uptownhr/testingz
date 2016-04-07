const router = require('express').Router();
var Project = require('../models/Project');

router.get('/', function(req,res){
  Project.find(function(err, project){
    res.render('home', {
      P: project
    })
  })
})


module.exports = router