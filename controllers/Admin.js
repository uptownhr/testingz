const router = require('express').Router(),
  qs = require('qs'),
  User = require('../models/User'),
  _ = require('lodash'),
  Entry = require('../models/Entry')

router.get('/', function(req,res){
  res.render('admin/overview')
})

router.get('/user', function(req,res){
  const query = req.query
  res.render('admin/user', {user: query})
})

router.get('/user/:id', function(req,res){
  User.findOne({_id: req.params.id}).then( user => {
    res.render('admin/user', {user})
  })
})

router.post('/user', function(req,res){
  req.assert('email', 'Email is not valid').isEmail();

  if(req.body.confirmPassword || req.body.password){
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  }

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/admin/user?' + qs.stringify(req.body));
  }
  const body = req.body
  User.findOne({_id: body._id})
    .then( user => {
      if(user){
        _.merge(user, req.body)
      }else{
        user = new User(body)
      }
      return user
    })
    .then( user => {
      user.save( (err,saved) => {
        if(err){
          req.flash('errors', [{msg: err.message}])
          return res.redirect('/admin/user?' + qs.stringify(req.body))
        }

        req.flash('success', [{msg: 'Saved'}])
        res.redirect('/admin/users')
      })
    })


  /*const user = new User(req.body)



  res.send({user, body: req.body})*/
})

router.get('/user/delete/:id', function(req,res){
  User.remove({_id: req.params.id}, function(err){
    if(err){
      req.flash('error', {msg: err.message} )
    }else{
      req.flash('success', {msg: 'deleted'} )
    }

    return res.redirect('/admin/users')
  })
})

router.get('/users', function(req,res){
  User.find().then(users => {
    res.render('admin/users', {users})
  })

})
/**
 * Blog Post Editing
 */

router.get('/blogListing', function(req, res){
  Entry.find(function(err, entry){
    console.log("this is the entries: ", entry)
    res.render('admin/blogListing',{
      e: entry
    })
  })
})

router.get('/createBlog', function(req, res){
  res.render('admin/createBlog')
})

router.post('/saveBlog', function(req, res){
  const body = req.body
  console.log("this is the post content: ", body)
  var id = req.body._id
  Entry.findOne({_id: id}, function(err, entry){
    if(entry) {
      entry.title=body.title;
      entry.content=body.content;
      entry.status=body.status;
      if(err) console.log(err)
      console.log("SAVED: ", entry)
      entry.save(function(err, save){
        console.log("Did it save?: ", save);
      })
      res.redirect('/admin/blogListing')
    }
    else {
      var entry = new Entry({
        title: body.title,
        content: body.content,
        status: body.status
      })
      entry.save(function(err, saved){
        console.log("did it save?: ", saved)
      })
      res.redirect('/admin/blogListing')
    }
  })
})

router.get('/editBlog/:_id', function(req, res){
  var id = req.params._id
  Entry.findOne({_id: id}, function(err, entry){
    res.render('admin/editBlog',{
      entry: entry
    })
  })
})

router.get('/deleteBlog/:id', function(req,res){
  Entry.remove({_id: req.params.id}, function(err){
    if(err){
      req.flash('error', {msg: err.message} )
    }else{
      req.flash('success', {msg: 'deleted'} )
    }

    return res.redirect('/admin/blogListing')
  })
})
module.exports = router