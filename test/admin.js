"use strict"
var request = require('supertest'),
  mongoose = require('mongoose')
var app = require('../index.js');

const admin_user = {
  email: 'admin@admin.com',
  password: 'asdfasdf'
}

// for storing session
const admin = request.agent(app);

describe('Admin', function(){
  before(function(done){

    /*create admin login */
    admin
      .post('/auth/login')
      .send(admin_user)
      .expect(302, done)
  })

  after( function(){
    //mongoose.connection.close()
    //app.server.close()
  })


  describe('Admin not logged in', function(){
    it('should return 303 when not admin', function(done){
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
      .expect(200, done)
    })
  })
})
