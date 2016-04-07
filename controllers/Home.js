const router = require('express').Router();
var Project = require('../models/Project');

router.get('/', function(req,res){
  Project.find(function(err, project){
    res.render('index', {
      P: project
    })
  })
})


module.exports = router