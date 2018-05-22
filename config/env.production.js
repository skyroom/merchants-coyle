// var merge = require('webpack-merge')
//
// var shared_env = require("./shared_env.js")
const path = require('path')
module.exports ={
  NODE_ENV: '"production"',
  service_url: '"http://10.66.30.66:8001"',
  port: 60003,
  assetsDirectory: path.resolve(__dirname, '../dist'),
  cache: {
      lruPageCache: {
          max: 1000,
          maxAge: 1000 * 60 * 15
      },
      assetsCache: {

      }
  },
  cssSourceMap: false,
}
