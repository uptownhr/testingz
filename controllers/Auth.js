const router = require('express').Router(),
  User = require('../models/User'),
  queryString = require('querystring')

router.get('/login', function(req,res){
  res.render('login')
})

router.get('/register', function(req,res){
  res.render('register', {
    query: req.query
  })
})

router.get('/logout', function(req,res){
  req.logout()

  res.redirect('/')
})

router.post('/register', function(req,res,next){
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 8 characters long').len(8);

  const errors = req.validationErrors();
  const body = req.body

  if (errors) {
    req.flash('errors', errors);
    delete body.password
    console.log(body, queryString.stringify(body) )
    return res.redirect('/auth/register?' + queryString.stringify(body) );
  }

  const user = new User({
    email: body.email,
    password: body.password,
    profile: {
      name: body.first_name + ' ' + body.last_name
    }
  })

  User.findOne({email: body.email}).exec()
    .then( (existingUser) => {
      if(existingUser){
        console.log(existingUser)
        req.flash('errors', { msg: 'Account with that email address already exists.' });
        return res.redirect('/auth/register')
      }

      return user.save()
    })
    .then( registeredUser => req.logIn(registeredUser, (err) => {
      if(err) return next(err)
      res.redirect('/')
    } ) )
    .catch( (err) => {
      if(err) return next(err)
    })
})


module.exports = router