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

let entryPoint = webpackConfig.entry;
console.log("entryPoint ==", entryPoint);

// Check for a config file and use it
let loaderConfig;
try {
  loaderConfig = JSON.parse(fs.readFileSync("./loader.config", "utf8"));
  console.log("config ==", loaderConfig, typeof loaderConfig);
  entryPoint = loaderConfig.entry;
} catch (e) {
  /* continue */
}
// console.log(JSON.parse(loaderConfig))
// setup webpack
if (process.argv[2]) {
  console.log("here")
  entryPoint = process.argv[2];
}
console.log("entryPoint ==", entryPoint);
// Check to see if we can find the entry point
if (!fs.existsSync(entryPoint)) {
  console.error("Could not find entry point. Failed to find:", entryPoint);
  process.exit(1);
}

const compiler = webpack(webpackConfig);
const watching = compiler.watch({}, (err, stats) => {
  if (err) {
    console.error(err);
  } else {
    isFresh = true;
  }
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
