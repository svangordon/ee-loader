#! /usr/bin/env node
'use strict';
// Make sure that you enable unsecure localhost in chrome!
const https = require('https');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const webpack = require('webpack');
const webpackConfig = require(__dirname + '/webpack.config.js');
const port = 8080;
let isFresh = true;

// Check for a config file and use it
let loaderConfig;
try {
  loaderConfig = fs.readFileSync("./loader.config");
  webpackConfig.entry = loaderConfig.entry;
} catch (e) {
  /* continue */
}

// setup webpack
if (process.argv[2]) {
  webpackConfig.entry = process.argv[2];
}

// Check to see if we can find the entry point
if (!fs.existsSync(webpackConfig.entry)) {
  console.error("Could not find entry point. Failed to find:", webpackConfig.entry);
  process.exit(1);
}

const compiler = webpack(webpackConfig);
const watching = compiler.watch({}, (err, stats) => {
  isFresh = true;
})

app.get('/', function(req, res) {
  fs.readFile('./dist/script.js', (err, data) => {
    if (err) {
      console.log('error: ', err);
    } else {
      res.end(data);
    }
  })
  isFresh = false;
});

app.get('/poll', function(req, res) {
  res.send(isFresh);
})

const httpsOptions = {
  key: fs.readFileSync(__dirname + '/key.pem'),
  cert: fs.readFileSync(__dirname + '/cert.pem')
};

const server = https.createServer(httpsOptions, app).listen(port, () => {
  console.log('server running at ' + port)
});
