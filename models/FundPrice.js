const mongoose = require('mongoose'),
  yahoo_charts = require('../lib/yahoo_charts')


var fundPriceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  _fund: { type: mongoose.Schema.ObjectId, required: true, ref: 'Fund' },
  price: { type: Number, required: true }
}, { autoIndex: true} )

fundPriceSchema.index({ date: 1, _fund: 1}, { unique: true })

fundPriceSchema.statics.populateFundPrices = async function addHistoricalPrices (fund) {
  const historical_prices = await yahoo_charts.get_historical_quotes([fund.symbol])
  const mapped = historical_prices.map( price => {
    delete price.symbol
    price._fund = fund._id
    price.price = parseFloat(price.price)
    price.date = new Date(price.date)

    return price
  })

  this.collection.insert(mapped, err => {
    if (err) {
      console.log(err)
    }else{
      console.log('inserted', err)
    }
  })
}

module.exports = mongoose.model('FundPrice', fundPriceSchema)
