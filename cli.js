#!/usr/local/bin/node
require('babel-register')
const program = require('commander')
const actions = require('./actions')
const colors = require('colors')


program
  .version('0.0.1')

program.command('step1')
  .description('fetch prices and create fund_prices.json')
  .action(actions.step1)

program.command('step2')
  .description('portfolio summary')
  .action(actions.step2)

program.command('step3')
  .description('portfolio asset class')
  .action(actions.step3)

program.command('step4')
  .description('fetch historical prices and create historical_prices.json')
  .action(actions.step4)

program.command('step5 <date>')
  .description('portfolio summary and asset allocation on given date')
  .action(actions.step5)

if (!process.argv.slice(2).length) {
  program.outputHelp(make_red);
}

program.parse(process.argv);

function make_red(txt) {
  return colors.red(txt); //display the help text in red on the console
}
