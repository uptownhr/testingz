"use strict"
var request = require('supertest');
var app = require('../index.js');

const admin_user = {
  email: 'admin@admin.com',
  password: 'asdfasdf'
}

// for storing session
const agent = request.agent(app);

describe('Admin', function(){
  before(function(done){
    agent
      .post('/auth/login')
      .send(admin_user)
      .expect(302, done)
  })

  describe('GET /admin/', function() {
    it('should return 200 OK', function(done) {
      agent
        .get('/admin/')
        .expect(200, done)
    });
    it('should return 303 when not admin', function(done){
      request(app)
        .get('/admin/')
        .expect(302, done)
    })
  });

  describe('GET /admin/users', function(){
    it('should return 200 OK', function(done){
      agent
      .get('/admin/users')
      .expect(200, done)
    })
  })
})