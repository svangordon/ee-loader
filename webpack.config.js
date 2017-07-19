var path = require('path');

module.exports = {
  entry: "./index.js",
  output: {
    filename: 'script.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
            parserOpts: {
              "allowReturnOutsideFunction": true,
              "loose": true
            }
          }
        }
      }
    ]
  }
};
