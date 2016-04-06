"use strict"
const User = require('../models/User'),
  Post = require('../models/Post')

module.exports = function(){
  User.findOne({ role: 'admin' }, function(err, user){
    if(err) return console.log(err)
    if(user) return false

    user = new User({
      email: 'admin@admin.com',
      password: 'asdfasdf',
      role: 'admin',
      askEmail: false,
      profile: {
        name: 'Admin'
      }
    });
    user.save(function(err,user){
      if (err) console.log(err);

      console.log('initial admin user created', user)

      Post.findOne( function(err, post){
        if(err) return console.log(err)
        if(post) return false

        post = new Post({
          title: 'First Blog Post',
          content: "## First blog post\n\nCheck it out\n\n [github](https://github.com/uptownhr/hackathon-starter-lite)",
          status: 'launched',
          _author: user._id,
        })

        post.save( function(err, saved){
          console.log('seed post created', saved)
          if(err) console.log(err)
        })
      })


    });
  });
}

