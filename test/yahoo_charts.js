const chai = require('chai'),
  should = chai.should(),
  numeral = require('numeral'),
  fs = require('fs')

const yahoo_charts = require('../lib/yahoo_charts')
const funds = require('../data/funds.json')
const portfolio = require('../data/portfolio.json')

describe('yahoo_charts', function() {
  describe('get_quotes', function(){
    it('returns an array of objects', async function(){
      const symbols = funds.map(f => f.symbol)
      const prices = await yahoo_charts.get_quotes(symbols)

      prices.length.should.be.above(0)
      prices[0].should.have.property('symbol')

      fs.writeFile( __dirname + "/../data/fund_prices.json", JSON.stringify(prices), function(err) {
        if(err) {
          return console.log(err);
        }
      });
    })
  })

  describe('calculate portfolio', function(){
    it('merges portfolio info', async function(){
      const prices = require('../data/fund_prices.json')
      const merged_portfolio = yahoo_charts.merge_portfolio(portfolio, funds, prices)

      const total = merged_portfolio.reduce( (prev, curr) => {
        return prev + curr.price * curr.shares
      }, 0)

      merged_portfolio.forEach( p => {
        console.log(`${p.name}: ${p.shares} shares at $${numeral(p.price).format('0,0.00')} ea. -- $${numeral(p.shares * p.price).format('0,0.00')} `)
      })

      console.log(`Total: $${numeral(total).format('0,0.00')}`)
    })
  })

  describe('calculate_by_class', function(){
    it('groups by classes', async function(){
      const prices = require('../data/fund_prices.json')
      const merged_portfolio = yahoo_charts.merge_portfolio(portfolio, funds, prices)

      const by_asset_class = yahoo_charts.calculate_by_class(merged_portfolio)

      by_asset_class.forEach( clas => {
        console.log(`${clas.assetClass}: %${clas.percentage}`)
      })
    })
  })

  describe('get_historical_quotes', function(){
    it('returns all historical quotes', async function(){
      const symbols = portfolio.map(f => f.symbol)
      let prices = await yahoo_charts.get_historical_quotes(symbols)

      fs.writeFile( __dirname + "/../data/historical_prices.json", JSON.stringify(prices), function(err) {
        if(err) {
          return console.log(err);
        }
      });
    })
  })

  describe.only('find_portfolio', function(){
    it('returns merged portfolio for given date', async function(){
      const historical_prices = require('../data/historical_prices')
      const allocation_sets = require('../data/allocation_sets.json')

      let portfolio = yahoo_charts.find_portfolio('8-1-2014', allocation_sets)

      portfolio.date.should.equal('7-1-2014')
      portfolio = yahoo_charts.find_portfolio('3-30-2014', allocation_sets)
      portfolio.date.should.equal('3-5-2014')
      portfolio = yahoo_charts.find_portfolio('3-1-2014', allocation_sets)
      portfolio.date.should.equal('1-1-2014')

      let date = '8-1-2014'
      let prices = historical_prices.filter( p => {
        return new Date(p.date).toString() == new Date(date).toString()
      })

      //console.log(portfolio, prices)
      const merged_portfolio = yahoo_charts.merge_portfolio(portfolio.portfolio, funds, prices)

      const total = merged_portfolio.reduce( (prev, curr) => {
        return prev + curr.price * curr.shares
      }, 0)

      merged_portfolio.forEach( p => {
        console.log(`${p.name}: ${p.shares} shares at $${numeral(p.price).format('0,0.00')} ea. -- $${numeral(p.shares * p.price).format('0,0.00')} `)
      })

      console.log(`Total: $${numeral(total).format('0,0.00')}`)

      const by_asset_class = yahoo_charts.calculate_by_class(merged_portfolio)

      console.log("\nAsset Class Breakdown")
      by_asset_class.forEach( clas => {
        console.log(`${clas.assetClass}: %${clas.percentage}`)
      })

    })
  })
})
