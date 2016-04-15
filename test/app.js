var request = require('supertest'),
  mongoose = require('mongoose');

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

  describe('GET /auth/register', function() {
    it('should return 200 OK', function(done) {
      request(app)
        .get('/auth/register')
        .expect(200, done);
    });
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

})
