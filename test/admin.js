"use strict"
var request = require('supertest'),
  mongoose = require('mongoose'),
  Models = require('../models'),
  User = Models.User,
  Post = Models.Post,
  Project = Models.Project,
  Product = Models.Product,
  File = Models.File


var app = require('../index.js');

const admin_user = {
  email: 'admin@admin.com',
  password: 'asdfasdf'
}

// for storing session

const admin = request.agent(app);
const adminLoggedIn = function(){
  return new Promise( function(resolve, reject){
    /*create admin login */
    admin
      .post('/auth/login')
      .send(admin_user)
      .expect(302, function(e){
        if(e) return reject(e)
        return resolve()
      })
  })

}

describe('Admin', function(){
  const sample_user = User({ email: 'test@test.com', password: 'asdfasdf' })
  const sample_post = Post({ title: ''})
  const sample_project = Project({name: "gordo", description: "projectFAT" })
  const sample_product = Product({name: "gordo", description: "productFAT" })
  const sample_file = File({originalname: "gordo", destination: "fileFAT" })

  before(function(done){
    Promise.all([
      adminLoggedIn(),
      sample_user.save(),
      sample_post.save(),
      sample_project.save(),
      sample_product.save(),
      sample_file.save()
    ]).then( () => done(), function error(err){
      done(err)
    })

  })

  describe('Admin not logged in', function(){
    it('should return 302 when not admin', function(done){
      request(app)
        .get('/admin/')
        .expect(302, done)
    })
  })

  describe('GET /admin/', function() {
    it('should return 200 OK', function(done) {
      admin
        .get('/admin/')
        .expect(200, done)
    });
  });

  describe('GET /admin/users', function(){
    it('should return 200 OK', function(done){
      admin
        .get('/admin/users')
        .expect(200)
        .then( function(){
          done()
        })
    })
  })

  describe('GET /admin/user', function(){
    it('should return 200 OK', function(done){
      admin
        .get('/admin/user')
        .expect(200)
        .then( function(){
          done()
        })
    })
  })

  describe('GET /admin/posts', function(){
    it('should return 200 OK', function(done){
      admin
        .get('/admin/posts')
        .expect(200, done)
    })
  })

  describe('GET /admin/products', function(){
    it('should return 200 OK', function(done){
      admin
        .get('/admin/products')
        .expect(200, done)
    })
  })

  describe('GET /admin/files', function(){
    it('should return 200 OK', function(done){
      admin
        .get('/admin/files')
        .expect(200, done)
    })
  })

  describe('GET /admin/user', function(){
    it('should return 200 OK', function(done){
      admin
        .get('/admin/user')
        .expect(200, done)
    })
  })

  describe('GET /admin/user/:id', function(){
    it('should return 200 OK', function(done){
      admin
        .get('/admin/user/' + sample_user._id)
        .expect(200, done)
    })
  })

  describe('GET /admin/post', function(){
    it('should return 200 OK', function(done){
      admin
        .get('/admin/post')
        .expect(200, done)
    })
  })

  describe('GET /admin/post/:id', function(){
    it('should return 200 OK', function(done){
      admin
        .get('/admin/post/' + sample_post._id)
        .expect(200, done)
    })
  })

  describe('GET /admin/project', function(){
    it('should return 200 OK', function(done){
      admin
        .get('/admin/project')
        .expect(200, done)
    })
  })

  describe('GET /admin/project/:id', function(){
    it('should return 200 OK', function(done){
      admin
        .get('/admin/project/' + sample_project._id)
        .expect(200, done)
    })
  })

  describe('GET /admin/product', function(){
    it('should return 200 OK', function(done){
      admin
        .get('/admin/product')
        .expect(200, done)
    })
  })

  describe('GET /admin/product/:id', function(){
    it('should return 200 OK', function(done){
      admin
        .get('/admin/product/' + sample_product._id)
        .expect(200, done)
    })
  })

  describe('GET /admin/file', function(){
    it('should return 200 OK', function(done){
      admin
        .get('/admin/file')
        .expect(200, done)
    })
  })

  describe('GET /admin/file/:id', function(){
    it('should return 200 OK', function(done){
      admin
        .get('/admin/file/' + sample_file._id)
        .expect(200, done)
    })
  })

  after( function(){
    sample_user.remove()
    sample_post.remove()
    sample_project.remove()
    sample_product.remove()
    sample_file.remove()
  })
})
