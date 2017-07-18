#! /usr/bin/env node
'use strict';
// Make sure that you enable unsecure localhost in chrome!
const express = require('express');
var cors = require('cors');
const app = express();
app.use(cors());

var https = require('https');
var http = require('http');
var fs = require('fs');

const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

const port = 8080;
let isFresh = true;

// setup webpack
if (process.argv[2]) {
  webpackConfig.entry = "./src/" + process.argv[2]
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
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
};

const server = https.createServer(httpsOptions, app).listen(port, () => {
  console.log('server running at ' + port)
});
