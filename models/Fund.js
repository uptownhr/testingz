var mongoose = require('mongoose'),
  FundPrice = require('./FundPrice')

var fundSchema = new mongoose.Schema({
  name: { type: String, required: true },
  symbol: { type: String, required: true, uppercase: true},
  asset_class: { type: String, required: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
})

fundSchema.pre('save', function (next) {
  this.wasNew = this.isNew
  next()
})

fundSchema.post('save', function (doc) {
  if (this.wasNew) {
    try {
      FundPrice.populateFundPrices(doc)
    } catch (e) {
      console.log(e)
    }

  }
})

module.exports = mongoose.model('Fund', fundSchema)
