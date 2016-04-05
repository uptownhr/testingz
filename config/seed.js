"use strict"
const User = require('../models/User'),
  Post = require('../models/Post')

module.exports = function(){
  User.findOne({ role: 'admin' }, function(err, user){
    if(err) return console.log(err)
    if(user) return false

    user = new User({
      email: 'admin@admin.com',
      password: 'admin',
      role: 'admin',
      askEmail: false
    });
    user.save(function(err,user){
      if (err) console.log(err);

      console.log('initial admin user created', user)

      Post.findOne( function(err, post){
        if(err) return console.log(err)
        if(post) return false

        post = new Post({
          title: 'First Blog Post',
          content: "## First blog post\n\nCheck it out\n\n ### [home](/)",
          userID: user._id,
          status: 'launched'
        })

        post.save( function(err, saved){
          console.log('seed post created', saved)
          if(err) console.log(err)
        })
      })


    });
  });
}