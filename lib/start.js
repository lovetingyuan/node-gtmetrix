'use strict';

var config = require('./command');
var serve = require('./serve');
var startTest = require('./main');
var path = require('path');

function parseArgs() {
  if (config.remote) {
    return startTest(config.remote);
  }
  if (config.port) {
    return serve.startTunnel(config.port === true ? 80 : config.port).then(function (url) {
      return startTest(url);
    });
  }
  if (config.dir) {
    var rootPath = process.cwd();
    if (typeof config.dir === 'string') {
      rootPath = path.resolve(config.dir);
    }
    return serve.startServer(rootPath).then(function (port) {
      return serve.startTunnel(port);
    }).then(function (url) {
      return startTest(url);
    });
  }
  return serve.startServer(process.cwd()).then(function (port) {
    return serve.startTunnel(port);
  }).then(function (url) {
    return startTest(url);
  });
}

module.exports = function start() {
  parseArgs().then(function () {
    console.log('Thanks for using!');
    process.exit(0);
  }).catch(function (e) {
    console.log('Sorry, there is an error:', e);
    console.log('Please check your options and the accessibility of your site or directory permissions');
    process.exit(1);
  });
};