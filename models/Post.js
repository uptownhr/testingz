var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
  date: {type: Date, default: Date.now()},
  title: {type: String},
  content: {type: String},
  userID: {type: mongoose.Schema.ObjectId, ref: 'User' },
  status: {type: String, enum: ['pending', 'launched', 'queued']}
})

module.exports = mongoose.model('post', postSchema)