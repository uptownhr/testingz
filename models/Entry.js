var mongoose = require('mongoose');

var blogEntrySchema = new mongoose.Schema({
  date: {type: Date, default: Date.now()},
  title: {type: String},
  content: {type: String},
  userID: {type: String},
  status: {type: String, enum: ['pending', 'launched', 'queued']}
})



module.exports = mongoose.model('blogEntry', blogEntrySchema)