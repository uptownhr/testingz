# Captain401 Code Challenge

This challenge is an opportunity for you to demonstrate your programming skills, as well as an opportunity for us to get you excited about the sort of problems we tackle at scale.

Feel free to implement your solutions using any freely available programming language, and any open source libraries available for that language. We encourage you to use a language that you know well, rather than using this as an opportunity to experiment with a less familiar one.

The best way to impress us is to write clean code with clear comments.

You should budget about two hours to finish everything under "Core". After you've completed that, consider trying one or two of our Side Quests. They're much more open ended, and we encourage you to be creative with them!

After you're finished, please zip up all of your code and e-mail it to `paul@captain401.com`

Include a `README` file in plaintext or markdown format. Make sure to include information about how to run your code, as well as a brief explanation of how you approached this challenge, and the trade-offs you considered while tackling it. Feel free to include any other materials that help demonstrate your problem solving process (e.g. notes, drawings, tests).

Please don't share any of the code you wrote for this assignment in any public repository.

## Core

### Step 1: Fund Prices

The file `funds.json` describes several index funds that we're going to use to build portfolios. Each JSON representation of a fund includes its name, its ticker symbol, and its asset class.

Take a look at the Yahoo Finance API as documented in `csvQuotesDownload.md` and `enumQuoteProperty.md`. Write a script that downloads today's fund prices ("latest value" in the docs) in CSV format, and outputs them to a file called `fund_prices.json`.

`fund_prices.json` should be an array of JSON objects that contain ticker symbols and corresponding prices. It should look similar to this:

```json
[
  {
    "symbol": "VFIAX",
    "price": 10.53
  },
  {
    "symbol": "VTSAX",
    "price": 90.2
  }
]
```

Make sure your code can be run from the command line like so:
```
$ step1
```

### Step 2: Portfolios

The file `portfolio.json` contains a JSON object representing the state of a user's portfolio. Each JSON object contains a ticker symbol, and the number of shares that user holds in a certain fund.

Multiply the number of shares for each fund in the user's portfolio by its price. Sum those to calculate the value of the entire portfolio.

Write a script that reads `portfolio.json` (as well as `funds.json`, and `fund_prices.json`) and outputs the value of the user's holdings in the below format.

Your program should be runnable from the command line and produce output like this:
```
$ step2
Vanguard 500 Index Admiral: 5 shares at $173.59 ea. -- $867.95
Vanguard Total Stock Market Index Fund Admiral: 29 shares at $47.18 ea. -- $1,368.22
Vanguard Long-Term Bond Index: 5 shares at $13.54 ea. -- $67.70
Total: $2,303.87
```

### Step 3: Asset Class Breakdown

Modify your code from Step 2 to include the proportional breakdown of asset classes in the user's portfolio.

Calculate (by total dollar value) the percentage of the user's total portfolio that belongs to each individual asset class present. Round to two decimal places.

Your program should be runnable like this, and produce similar output:
```
$ step3
Asset Class Breakdown
  U.S. Bonds: 2.94%
  U.S. Stocks: 97.06%
```

### Step 4: Historical Prices

Now it's time to take a look at funds *across time*.

Yahoo Finance has an API for downloading historical price data. Take a look at `csvHistQuotesDownload.md` and write a script that downloads daily closing prices (`Close` in the CSV) for each of our funds.

Have it download prices from 1/1/2014 until 1/1/2015, and output them in a file called `historical_prices.json`. The file should be an array of JSON objects, and be structured something like this:

```json
[
  {
    "date": "1-1-2014",
    "symbol": "VTSAX",
    "price": 10.01
  },
  {
    "date": "1-2-2014",
    "symbol": "VTSAX",
    "price": 10.06
  },
  // ...
]
```

### Step 5: Historical Portfolios

Write a program that reads `allocation_sets.json`, a JSON file that contains a list of portfolios and corresponding dates. Write a script that accepts a date, and calculates the value of the portfolio on that date, using that date's prices. If we don't have a portfolio matching that exact date, use the portfolio allocations from the most recent one before.

Also include the asset class breakdown for that portfolio on that date.

Your program should be runnable like this, and produce similar output:
```
$ step5 6-2-2014
Vanguard 500 Index Admiral: 5 shares at $160.30 ea. -- $801.50
Vanguard Total Stock Market Index Fund Admiral: 29 shares at $43.78 ea. -- $1,269.62
Vanguard Long-Term Bond Index: 5 shares at $11.34 ea. -- $56.70
Total: $2,127.82

Asset Class Breakdown
  U.S. Bonds: 2.67%
  U.S. Stocks: 97.34%
```

## Side Quests

### Database

Think about all of the data (funds, prices, allocations) we have scattered across JSON files. What's the best way to store it in a database?

Try modifying your scripts to load and query this data with the datastore of your choice. Feel free to use any freely available database (SQL, NoSQL, or otherwise) that you feel is suited to the task. Describe the schema you create in your README.

What trade-offs have you made? What are the advantages of your design?

### Data Visualization

Create an interesting (not necessarily interactive) visualization of this data. Can you easily output a line graph of the value of a portfolio over time? How about a way to visualize the asset class breakdown of a portfolio?

### REST API

Take the scripts you wrote in the Core section and put their functionality behind a [REST](http://rest.elkstein.org/) service of your design. Feel free to use any freely available web framework you like for this.

Document your API's endpoints in your README. Be sure to explain why you designed them as you did. 

### Web App

Build a simple web app that allows us to view a portfolio on any given day. Feel free to use any freely available web framework you like for this.

Consider building features that make it possible to create new allocation sets or edit existing ones.