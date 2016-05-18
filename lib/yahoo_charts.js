const request = require('request-promise'),
  parse = require('csv-parse'),
  Promise = require('bluebird')

const base_urls = {
  quotes: 'http://download.finance.yahoo.com/d/quotes.csv',
  historical: 'http://ichart.yahoo.com/table.csv'
}

const base_url = 'http://ichart.yahoo.com/table.csv'

module.exports = {
  get_quotes (symbols) {
    const path = base_urls.quotes + `?s=${symbols.join(',')}&f=sl1&e=.csv`
    return request(path).then(mapQuoteCSV)
  },

  get_historical_quotes (symbol) {
    const symbols_encoded = symbol.map( sym => encodeURIComponent(sym) )

    return Promise.map(symbols_encoded, sym => {
      let path = base_urls.historical + `?s=${sym}&a=0&b=0&c=2014&d=0&e=0&f=2015&g=d&ignore=.csv`
      return request(path)
    })
  },

  merge_portfolio (portfolio, funds, prices) {
    let merged_portfolio =  portfolio.map(portfolio => {
      let price = parseFloat(prices.find( price => price.symbol == portfolio.symbol).price)
      let {name, assetClass} = funds.find( fund => fund.symbol == portfolio.symbol)

      portfolio.price = price
      portfolio.name = name
      portfolio.assetClass = assetClass
      return portfolio
    })

    return merged_portfolio
  },

  calculate_by_class (portfolio) {
    const total = portfolio.reduce( (prev, curr) => {
      return prev + curr.price * curr.shares
    }, 0)

    const classes = portfolio.reduce((prev, curr) => {
      let group = prev.find( g => g.assetClass == curr.assetClass )

      if (group) {
        group.funds.push(curr)
      } else {
        group = {
          assetClass: curr.assetClass,
          funds: [curr]
        }

        prev.push(group)
      }

      return prev
    }, [])

    return classes.map( clas => {
      clas.amount = +(clas.funds.reduce((p,c) => p + c.price * c.shares, 0).toFixed(2))
      clas.percentage = +(clas.amount / total * 100).toFixed(2)
      return clas
    })
  }
}

function mapQuoteCSV(csv){
  return csv.trim().split("\n").map( row => {
    const match_quotes = new RegExp('"', 'g')
    const hash = row.split(',').map(item => item.replace(match_quotes, ''))

    return {
      symbol: hash[0],
      price: hash[1]
    }
  })
}