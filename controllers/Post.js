const router = require('express').Router();
var Post = require('../models/Post');
var marked = require('marked');

marked.setOptions({
  gfm: false
})

router.get('/', function(req,res){
  Post.find().populate('_author').exec(function(err, posts){
    posts = posts.map( post => {
      post.content = marked(post.content)
      return post
    } )

    res.render('post/list',{
      posts
    })
  })
})

router.get('/post/:id', function(req, res){
  var id = req.params.id
  Post.findOne({_id: id}).populate('_author').exec( function(err, post){
    post.content = marked(post.content)
    res.render('post/view',{
      post
    })
  })
})

module.exports = router