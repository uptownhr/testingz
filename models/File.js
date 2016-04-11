var mongoose = require('mongoose');

var fileSchema = new mongoose.Schema({
  originalname: String,
  encoding: String,
  mimetype: String,
  destination: String,
  filename: String,
  path: String,
  size: Number
})

module.exports = mongoose.model('file', fileSchema)