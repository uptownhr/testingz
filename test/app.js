var request = require('supertest'),
  mongoose = require('mongoose'),
  Post = require('../models/Post');

var app = require('../index.js')

const user = request.agent(app)
const user_info = {
  email: 'admin@admin.com',
  password: 'asdfasdf'
}


describe( 'App', function(){
  before(function(done){

    user
      .post('/auth/login')
      .send(user_info)
      .expect(302, done)
  })

  describe('GET /', function() {
    it('should return 200 OK', function(done) {
      request(app)
        .get('/')
        .expect(200, done);
    });
  });

  describe('GET /auth/login', function() {
    it('should return 200 OK', function(done) {
      request(app)
        .get('/auth/login')
        .expect(200, done);
    });
  });
  
  describe('GET /auth/logout', function() {
    it('should return 302 redirect', function(done){
      request(app)
      .get('/auth/logout')
      .expect(302, done)
    })
  });
  
  describe('GET /auth/logout', function() {
    it('should return 302 redirect', function(done){
      request(app)
      .get('/auth/logout')
      .expect(302, done)
    })
  });

  describe('GET /auth/register', function() {
    it('should return 200 OK', function(done) {
      request(app)
        .get('/auth/register')
        .expect(200, done);
    });
  });
  
  describe('GET /auth/register', function() {
    it('should return 200 OK', function(done) {
      request(app)
        .get('/auth/register')
        .expect(200, done);
    });
  });
  
  describe('GET /auth/o/twitter', function() {
    it('should return 302 redirect', function(done){
      request(app)
      .get('/auth/o/twitter')
      .expect(302, done)
    })
  });
  
  describe('GET /auth/o/twitter/callback', function() {
    it('should return 302 redirect', function(done){
      request(app)
      .get('/auth/o/twitter/callback')
      .expect(302, done)
    })
  });
  
  describe('GET /auth/o/testing/', function() {
    it('should return 302 redirect', function(done){
      request(app)
      .get('/auth/o/testing')
      .expect(302, done)
    })
  });
  
  describe('GET /auth/o/testing/callback', function() {
    it('should return 302 redirect', function(done){
      request(app)
      .get('/auth/o/testing/callback')
      .expect(302, done)
    })
  });
  
  describe('GET /random-url', function() {
    it('should return 404', function(done) {
      request(app)
        .get('/reset')
        .expect(404, done);
    });
  });

  describe('GET /blog', function(){
    it('should return 200', function(done){
      request(app)
        .get('/blog')
        .expect(200, done)
    })
  })

  describe('GET /user/account', function(){
    it('should return 300 unauthorized', function(done){
      request(app)
      .get('/user/account')
      .expect(302, done)
    })


    it('should return 200 when authorized', function(done){
      user
        .get('/user/account')
        .expect(200,done)
    })
  })
  
  describe('GET /user/account/unlink/testing', function(){
    it('should return 302', function(done){
      request(app)
      .get('/user/account/unlink/testing')
      .expect(302, done)
    })
  });
  
  /*
  //expect 302 && mock_provider no longer exists in users
  describe('GET /user/account/unlink/mock_provider', function(){
    it('should return 302', function(done){
      request(app)
      .get('/user/account/unlink/mock_provider')
      .expect(302, done)
    })
  });
  
  
  describe('GET /blog/post/:id', function(){
    //create post record in db before testing
    var blog = new Post({
      title : 'Test Post',
      content : 'Test Description',
      status : 'pending'
    });

    blog.save(function(err, post){
      it('should return 200', function(done){
        console.log(post._id);
        request(app)
        .get('/blog/post/' + post._id)
        .expect(200, done)
      })
    });
    
  });*/
})
