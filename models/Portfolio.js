var mongoose = require('mongoose')

var allocationSchema = new mongoose.Schema({
  symbol: { type: mongoose.Schema.ObjectId, required: true },
  shares: { type: String, default: 0 }
})

var historicalAllocationSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  allocation: allocationSchema
})

var total = new mongoose.Schema({
  date: { type: Date, required: true },
  total: { type: Number, required: true }
})

var portfolioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  allocation: [allocationSchema],
  total: total,
  historical_totals: [total],
  historical_allocations: [historicalAllocationSchema]
})


module.exports = mongoose.model('Portfolio', portfolioSchema)
