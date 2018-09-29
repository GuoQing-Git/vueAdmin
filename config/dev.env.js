'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://192.168.0.193:8888/order"',
  // BASE_API: '"https://www.luoxingapp.com/order"'
})
