var mongoose = require('mongoose')

var fundPriceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  _fund: { type: mongoose.Schema.ObjectId, required: true, ref: 'Fund' },
  price: { type: Number, required: true }
})


module.exports = mongoose.model('FundPrice', fundPriceSchema)
