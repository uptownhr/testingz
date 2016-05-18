const fs = require('fs')
const yahoo_charts = require('./lib/yahoo_charts')
const numeral = require('numeral')

const funds = require('./data/funds.json')
const portfolio = require('./data/portfolio.json')

module.exports = {
  async step1 () {
    try{
      const symbols = funds.map(f => f.symbol)
      const prices = await yahoo_charts.get_quotes(symbols)

      fs.writeFile( __dirname + "/data/fund_prices.json", JSON.stringify(prices), function(err) {
        if(err) {
          return console.log(err);
        }

        console.log('file data/fund_prices.json saved')
      });
    }catch(e){
      console.log(e)
    }
  },

  step2 () {
    try{
      const prices = require('./data/fund_prices.json')
      const merged_portfolio = yahoo_charts.merge_portfolio(portfolio, funds, prices)

      const total = merged_portfolio.reduce( (prev, curr) => {
        return prev + curr.price * curr.shares
      }, 0)


      merged_portfolio.forEach( p => {
        console.log(`${p.name}: ${p.shares} shares at $${numeral(p.price).format('0,0.00')} ea. -- $${numeral(p.shares * p.price).format('0,0.00')} `)
      })

      console.log(`Total: $${numeral(total).format('0,0.00')}`)
    }catch(e){
      console.log(e)
    }
  },

  step3 () {
    try{
      console.log('3')
      const prices = require('./data/fund_prices.json')
      const merged_portfolio = yahoo_charts.merge_portfolio(portfolio, funds, prices)

      const by_asset_class = yahoo_charts.calculate_by_class(merged_portfolio)

      by_asset_class.forEach( clas => {
        console.log(`${clas.assetClass}: ${clas.percentage}%`)
      })
    }catch(e){
      console.log(e)
    }
  },

  async step4 (){
    const symbols = funds.map(f => f.symbol)
    let prices = await yahoo_charts.get_historical_quotes(symbols)

    fs.writeFile( __dirname + "/data/historical_prices.json", JSON.stringify(prices), function(err) {
      if(err) {
        return console.log(err);
      }
      console.log('file saved data/historical_prices.json')
    });
  },

  step5 (input_date) {
    const historical_prices = require('./data/historical_prices')
    const allocation_sets = require('./data/allocation_sets.json')

    let portfolio = yahoo_charts.find_portfolio(input_date, allocation_sets)

    let prices = historical_prices.filter( p => {
      return new Date(p.date).toString() == new Date(input_date).toString()
    })

    const merged_portfolio = yahoo_charts.merge_portfolio(portfolio.portfolio, funds, prices)

    const total = merged_portfolio.reduce( (prev, curr) => {
      return prev + curr.price * curr.shares
    }, 0)

    console.log(`Portfolio Date: ${portfolio.date}`)

    merged_portfolio.forEach( p => {
      console.log(`${p.name}: ${p.shares} shares at $${numeral(p.price).format('0,0.00')} ea. -- $${numeral(p.shares * p.price).format('0,0.00')} `)
    })

    console.log(`Total: $${numeral(total).format('0,0.00')}`)

    const by_asset_class = yahoo_charts.calculate_by_class(merged_portfolio)

    console.log("\nAsset Class Breakdown")
    by_asset_class.forEach( clas => {
      console.log(`${clas.assetClass}: %${clas.percentage}`)
    })
  }
}