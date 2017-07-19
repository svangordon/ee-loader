var path = require('path');
console.log("=== dirname ===", __dirname, path.resolve(__dirname, "node_modules"))
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
            presets: [path.resolve(__dirname, "node_modules", 'babel-preset-env')],
            parserOpts: {
              "allowReturnOutsideFunction": true,
              "loose": true
            }
          }
        }
      }
    ]
  },
  resolve:{
    modules: [
      path.resolve(__dirname, "node_modules")
    ]
  },
  resolveLoader: {
    modules: [path.resolve(__dirname, "node_modules"), "node_modules"],
    extensions: [".js", ".json"],
    mainFields: ["loader", "main"]
  }
};
