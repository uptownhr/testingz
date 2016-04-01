var request = require('supertest');
var app = require('../index.js');

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