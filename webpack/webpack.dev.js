const webpack = require('webpack');

module.exports = {
  mode: 'development',
  devServer: {
    hot: true,
    open: true
  },
  devtool: 'cheap-module-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.name': JSON.stringify('Developement')
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer']
    }),
  ]
}