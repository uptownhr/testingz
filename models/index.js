"use strict"

const path = require('path'),
  util = require('../util')

const routePath = path.join(__dirname, './'),
  models = util.generateDirectoryModules(routePath)

console.log(models)
module.exports = models