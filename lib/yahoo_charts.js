const request = require('request-promise'),
  parse = require('csv-parse'),
  Promise = require('bluebird')

const base_urls = {
  quotes: 'http://download.finance.yahoo.com/d/quotes.csv',
  historical: 'http://ichart.yahoo.com/table.csv'
}

module.exports = {
  get_quotes (symbols) {
    const path = base_urls.quotes + `?s=${symbols.join(',')}&f=sl1&e=.csv`
    return request(path).then(mapQuoteCSV)
  },

  get_historical_quotes (symbols) {
    const symbols_encoded = symbols.map( sym => encodeURIComponent(sym) )

    return Promise.map(symbols_encoded, sym => {
      let path = base_urls.historical + `?s=${sym}`
      console.log(path)
      return request(path).then( prices => {
        let arr = csvToArray(prices)
        arr.shift()

        return arr.map(mapHistoricalArr.bind(null, sym))
      })
    }).then( prices => {
      return [].concat.apply([], prices)
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
  },

  find_portfolio (date, allocation_sets) {
    let portfolio = allocation_sets.find( p => p.date == date)

    if(portfolio) return portfolio

    let reversed = Array.prototype.slice.call(allocation_sets).reverse()

    return reversed.find( p => {
      return (new Date(date) > new Date(p.date))
    } )
  }
}

function mapHistoricalArr(sym, arr){
  return {
    date: arr[0],
    symbol: sym,
    price: arr[4]
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

function csvToArray (csv) {
  return csv.trim().split("\n").map( row => {
    const match_quotes = new RegExp('"', 'g')
    return row.split(',').map(item => item.replace(match_quotes, ''))
  })
}