const router = require('express').Router();
var Entry = require('../models/Entry');
var marked = require('marked');

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: true,
  sanitize: true,
  smartLists: true,
  smartypants: true
})

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

router.get('/blogListing', function(req, res){
  Entry.find(function(err, entries){

    entries = entries.map( function(entry){
      entry.content = marked(entry.content)
      return entry
    } )

    console.log("WTF!!!!");
    console.log(entries);
    console.log("WTF======")

    res.render('blogListing',{
      e: entries
    })
  })
})
module.exports = router