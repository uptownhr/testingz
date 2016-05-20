var mongoose = require('mongoose')

var fundSchema = new mongoose.Schema({
  name: { type: String, required: true },
  symbol: { type: String, required: true, uppercase: true},
  asset_class: { type: String, required: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Fund', fundSchema)
