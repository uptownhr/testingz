var mongoose = require('mongoose');

var lessonSchema = new mongoose.Schema({
  title: { type: String },
  function: { type: String },
  description: { type: String },
  video_url: { type: String },
  image_url: { type: String },
  created_date: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('lesson', lessonSchema);
