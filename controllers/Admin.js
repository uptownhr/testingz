const router = require('koa-router')({ prefix: '/admin' })
const
  _ = require('lodash'),
  async = require('async'),
  multer = require('koa-multer'),
  path = require('path'),
  qs = require('qs'),
  validator = require('validator'),
  passport = require('../config/passport'),
  Promise = require('bluebird')

const { User, Post, File, Project, Product } = require('../models')

const upload = multer({ dest: path.join(__dirname, '../public/uploads') })

router.use(passport.isAuthenticated, passport.isAdmin)

router.get('/', async ctx => {
  ctx.render('admin/overview')
})

router.get('/users', async ctx => {
  let search = ctx.query.search
  let query = {}

  if (search) {
    search = { $regex: new RegExp(search, 'i') }
    query = { $or: [{ email: search }, { 'profile.name': search }] }
  }

  const users = await User.find(query)
  ctx.render('admin/users', { users, search: ctx.query.search })
})

router.get('/user', async ctx => {
  const user = {}
  const query = ctx.query

  _.merge(user, query)
  ctx.render('admin/user', { user })
})

router.get('/user/:id', async ctx => {
  const user = await User.findOne({ _id: ctx.params.id })

  ctx.render('admin/user', { user })
})

router.post('/user', async (ctx, next) => {
  const body = ctx.request.body

  ctx.checkBody('email').isEmail('Email is not valid');

  if (body.confirmPassword || body.password) {
    ctx.checkBody('password').len(4, 'Password must be at least 4 characters long')
    ctx.checkBody('confirmPassword').eq(body.password, 'Passwords do not match')
  } else {
    //no need to include password if user isn't setting one
    delete body.password;
  }

  //not a user model field
  delete body.confirmPassword

  if (ctx.errors) {
    ctx.flash('errors', ctx.errors)
    return ctx.redirect('/admin/user?' + qs.stringify(body))
  }

  const update = body._id

  let user = update ? await User.findOne({ _id: body._id }) : new User()

  delete body._id

  user = _.merge(user, body)

  try {
    const saved = await user.save()
    ctx.flash('success', ['Saved'])
    ctx.redirect('/admin/users')
  } catch (e) {
    console.log(e)
    ctx.flash('errors', [e.message])
    return ctx.redirect('back')
  }
})

router.get('/user/delete/:id', async ctx => {
  try {
    await User.remove({ _id: ctx.params.id })
    ctx.flash('success', { msg: 'deleted' })
  } catch (err) {
    ctx.flash('error', { msg: err.message })
  }

  return ctx.redirect('/admin/users')
})

/**
 * Blog Post Editing
 */

router.get('/posts', async ctx => {

  let search = ctx.query.search
  let query = {}

  if (search) {
    search = { $regex: new RegExp(search, 'i') }
    query = { $or: [{ title: search }] }
  }

  const posts = await Post.find(query)
  ctx.render('admin/posts', { posts, search: ctx.query.search })
})

router.get('/post', async ctx =>  {
  const post = {}
  const query = ctx.query

  _.merge(post, query)
  ctx.render('admin/post', { post })
})

router.get('/post/:id', async ctx => {
  const post = await Post.findOne({ _id: ctx.params.id })

  ctx.render('admin/post', { post })
})

router.post('/post', async ctx => {
  const body = ctx.request.body;
  const userId = ctx.request._id;
  const update = body._id;

  let post = update ? await Post.findOne({ _id: body._id }) : new Post()

  delete body._id

  post = _.merge(post, body);

  try {
    const saved = await post.save()
    ctx.flash('success', ['Saved'])
    ctx.redirect('/admin/posts')
  } catch (e) {
    console.log(e)
    ctx.flash('errors', [e.message])
    return ctx.redirect('back')
  }
})

router.get('/post/delete/:id', async ctx => {
  try {
    await Post.remove({ _id: ctx.params.id })
    ctx.flash('success', { msg: 'deleted' })
  } catch (err) {
    ctx.flash('error', { msg: err.message })
  }

  return ctx.redirect('/admin/posts')
})

//PROJECT SECTION
// list projects

router.get('/projects', async ctx => {
  let search = ctx.query.search
  let query = {}
  if (search) {
    search = { $regex: new RegExp(search, 'i') }
    query = { $or: [{ email: search }, { 'profile.name': search }] }
  }

  const projects = await Project.find(query)
  ctx.render('admin/projects', { projects, search: ctx.query.search })
})

// new projects
router.get('/project', async ctx => {
  const project = {}
  const query = ctx.query

  _.merge(project, query)
  ctx.render('admin/project', { project })
})

// view/edit projects
router.get('/project/:id', async ctx => {
  const project = await Project.findOne({ _id: ctx.params.id })
  ctx.render('admin/project', { project })
})

// add new/edit
router.post('/project', async (ctx, next) => {
  const body = ctx.request.body
  ctx.checkBody('name', 'Name of project is required').notEmpty()
  if (ctx.errors) {
    ctx.flash('errors', ctx.errors)
    return ctx.redirect('/admin/project?' + qs.stringify(body))
  }

  const update = body._id

  let project = update ? await Project.findOne({ _id: body._id }) : new Project()

  delete body._id

  project = _.merge(project, body)

  try {
    const saved = await project.save()
    ctx.flash('success', ['Saved'])
    ctx.redirect('/admin/projects')
  }
  catch (e) {
    ctx.flash('errors', [e.message])
    return ctx.redirect('back')
  }
})

router.get('/project/delete/:id', async ctx => {
  try {
    await Project.remove({ _id: ctx.params.id })
    ctx.flash('success', { msg: 'deleted' })
  } catch (err) {
    ctx.flash('error', { msg: err.message })
  }

  return ctx.redirect('/admin/projects')
})

// IMAGE DROP FUNCTION

router.post('/images/upload', upload.array('file', 20), async ctx => {
  ctx.body = await Promise.mapSeries(ctx.req.files, item => {
    let file = new File(item)
    return file.save()
  })
})

//PRODUCT START
// list products
router.get('/products', function (req, res) {
  var query = Product.find()
  var param = ''
  if (req.query.search) {
    var param = decodeURI(req.query.search)
    var search = { $regex: new RegExp(param, 'i') }
    query.or([
      { name: search }
    ])
  }

  query.exec(function (err, products) {
    res.render('admin/products', { products, search: param })
  })
})

// new products

router.get('/product', function (req, res) {
  const product = {}
  res.render('admin/product', { product })
})

// view/edit projects
router.get('/product/:id', function (req, res) {
  var id = req.params.id
  Product.findOne({ _id: id }, function (err, product) {
    res.render('admin/product', {
      product
    })
  })
})

// add new/edit
router.post('/product', function (req, res) {
  var id = req.body._id
  var body = req.body

  var errors = []
  if (!validator.isCurrency(body.price))
    errors.push('Price is not valid')

  if (errors.length) {
    req.flash('errors', { msg: errors.join('<br>') })
    return res.redirect('/admin/product/' + id)
  }

  async.waterfall([
    function (callback) {
      if (body._id.length) {
        Product.findOne({ _id: body._id }, function (err, product) {
          product = _.merge(product, req.body)
          callback(null, product)
        })
      } else {
        delete body._id //remove empty id from user

        var product = new Product(body)
        callback(null, product)
      }
    },

    function (product, callback) {
      product.save(function (err, saved) {
        callback(err, saved)
      })
    }
  ], function (err, product) {
    if (err) {
      console.log(err)
      req.flash('errors', [{ msg: err.message }])
      return res.redirect('/admin/product?' + qs.stringify(req.body))
    }

    req.flash('success', [{ msg: product.name + ' saved' }])
    res.redirect('/admin/products')
  })
})

router.get('/product/delete/:id', function (req, res) {
  Product.remove({ _id: req.params.id }, function (err) {
    if (err) {
      req.flash('error', { msg: err.message })
    }else {
      req.flash('success', { msg: 'deleted' })
    }

    return res.redirect('/admin/products')
  })
})

//PRODUCT END

//display listings of files
router.get('/files', async ctx => {
  let search = ctx.query.search
  let query = {}

  if (search) {
    search = { $regex: new RegExp(search, 'i') }
    query = { $or: [{ originalName: search }, { filename: search }] }
  }

  const files = await File.find(query)
  ctx.render('admin/files', { files, search: ctx.query.search })
})

//ADD new file model
router.get('/file', async ctx => {
  ctx.render('admin/file')
})

//view/edit file model
router.get('/file/:id', async ctx => {
  var id = ctx.params.id

  const file = await File.findOne({ _id: id })

  ctx.render('admin/file', {
    file
  })
})

// remove file model
router.get('/file/delete/:id', async ctx => {
  try {
    await File.remove({ _id: ctx.params.id })
    ctx.flash('success', ['deleted'])
  }catch (e) {
    req.flash('success', { msg: 'deleted' })
  }

  return ctx.redirect('/admin/files')
})

module.exports = router
