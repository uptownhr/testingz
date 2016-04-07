const
  router = require('express').Router(),
  _ = require('lodash'),
  async = require('async'),
  multer = require('multer'),
  path = require('path'),
  upload = multer({ dest: path.join(__dirname, '../uploads') }),
  qs = require('qs'),
  marked = require('marked'),
  models = require('../models'),
  User =  models.User,
  Post = models.Post,
  File = models.File

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

router.get('/', function(req,res){
  res.render('admin/overview')
})

router.get('/user', function(req,res){
  const user = {}
  res.render('admin/user', {user} )
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

router.get('/posts', function(req,res){
  Post.find(function(err, posts){
    res.render('admin/posts',{
      posts
    })
  })
})

router.get('/post', function(req, res){
  const post = {}
  res.render('admin/post', {post} )
})

router.get('/post/:id', function(req, res){
  const id = req.params.id

  Post.findOne({_id: id}, function(err, post){
    if(post) return res.render('admin/post', {post} )
  })

})

router.post('/post', function(req, res){
  const body = req.body,
    user_id = req.user._id

  var id = req.body._id
  Post.findOne({_id: id}, function(err, post){
    if(post) {
      post.title = body.title;
      post.content = body.content;
      post.status = body.status;
      post._author = user_id

      post.save(function(err, save){
        res.redirect('/admin/posts')
      })
    }else{
      var post = new Post({
        title: body.title,
        content: body.content,
        status: body.status,
        _author: user_id
      })

      post.save(function(err, saved){
        res.redirect('/admin/posts')
      })
    }
  })
})


router.get('/post/delete/:id', function(req,res){
  Post.remove({_id: req.params.id}, function(err){
    if(err){
      req.flash('error', {msg: err.message} )
    }else{
      req.flash('success', {msg: 'deleted'} )
    }

    return res.redirect('/admin/posts')
  })
})


//PROJECT SECTION


// list projects
router.get('/projects', function(req,res){
  Project.find(function(err, project){
    res.render('admin/projectList',{
      p: project
    })
  })
})


// new projects
router.get('/project', function(req, res){
  const project = {}
  res.render('admin/projectEdit', {p: project} )
})

// view/edit projects
router.get('/project/:id', function(req,res){
  var id = req.params.id;
  Project.findOne({_id: id}, function(err, project){
    console.log("this is the PROJECT to edit: ", project)
    res.render('admin/projectEdit', {
      p: project
    })
  })
})

// add new/edit
router.post('/project', function(req, res){
  var id = req.body._id
  var body = req.body;
  Project.findOne({_id: id}, function(err, project){
    if(project){
      project.name=body.name;
      project.tag_line=body.tag_line;
      project.description=body.description;
      project.logo_url=body.logo_url;
      project.project_url=body.project_url
      project.save(function(err, saved){
        console.log("this is what SAVED: ", saved)
        res.redirect('/admin/projects')
      })
    } else{
      var project = new Project({
        name: body.name,
        tag_line: body.tag_line,
        description: body.description,
        logo_url: body.logo_url,
        project_url: body.project_url
      })
      project.save(function(err, saved) {
        console.log("this is the saved data: ", saved);
        res.redirect('/admin/projects')
      })
    }
  })
})
// update
router.post('/project/:id', function(req, res){
  var id = req.params.id;
  var body = req.body;
  Project.findOne({_id: id}, function(err, project){
    project.name=body.name;
    project.tag_line=body.tag_line;
    project.description=body.description;
    project.logo_url=body.logo_url;
    project.project_url=body.project_url;
    project.save(function(err, saved){
      console.log("this is what is Saved: ", saved);
      res.redirect('/admin/projects')
    })
  })
})

router.get('/project/delete/:id', function(req, res){
  Project.remove({_id: req.params.id}, function(err){
    if(err){
      req.flash('error', {msg: err.message} )
    }else{
      req.flash('success', {msg: 'deleted'} )
    }
    return res.redirect('/admin/projects')
  })
})


router.post('/images/upload', upload.array('file', 20), function(req,res){
  async.mapSeries( req.files, function(file, next){
    file = new File(file)
    file.save( saved => next(err,saved) )
  }, function done(err, results){
    const file_names = req.results.map( file => file.originalname ).join('<br/>')
    res.send(`files uploaded<br/> ${file_names}`)
  })
})

module.exports = router
