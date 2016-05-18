const chai = require('chai')
const should = chai.should()
const numeral = require('numeral')

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
    })
  })

  describe('calculate portfolio', function(){
    it('merges portfolio info', async function(){
      const symbols = portfolio.map(f => f.symbol)
      const prices = await yahoo_charts.get_quotes(symbols)

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
      const symbols = portfolio.map(f => f.symbol)
      const prices = await yahoo_charts.get_quotes(symbols)

      const merged_portfolio = yahoo_charts.merge_portfolio(portfolio, funds, prices)

      const by_asset_class = yahoo_charts.calculate_by_class(merged_portfolio)

      by_asset_class.forEach( clas => {
        console.log(`${clas.assetClass}: %${clas.percentage}`)
      })
    })
  })

  describe.only('get_historical_quote', function(){
    it('returns all historical quotes', async function(){
      const symbols = portfolio.map(f => f.symbol)
      let wtf = await yahoo_charts.get_historical_quotes(symbols)
    })

  })
})
