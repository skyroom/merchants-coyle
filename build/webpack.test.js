module.exports = {
  entry: './test/unit/index.js',
  output: {
    path: __dirname,
    filename: '../test/unit/unit-bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      }
    ]
  }
}
