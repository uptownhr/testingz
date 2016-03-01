"use strict"
const fs = require('fs')

exports.generateDirectoryModules = function(path){
  return fs.readdirSync(path)
    .filter( (file) => file != 'index.js' )
    .reduce( (result, file) => {
      let name = file.replace('.js', '')

      result[name] = require( path + "/" + file)

      return result
    }, {})
}