'use strict';

var command = require('./command');
var serve = require('./serve');
var startTest = require('./main');
var path = require('path');

function parseArgs(config) {
  if (config.remote) {
    return startTest(config.remote, config);
  }
  if (config.port) {
    return serve.startTunnel(config.port === true ? 80 : config.port).then(function (url) {
      return startTest(url, config);
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
      return startTest(url, config);
    });
  }
  return serve.startServer(process.cwd()).then(function (port) {
    return serve.startTunnel(port);
  }).then(function (url) {
    return startTest(url, config);
  });
}

module.exports = function start(_program) {
  var program = _program || command();

  return parseArgs(program).then(function (result) {
    console.log('Thanks for using!');
    if (process.env.NODE_ENV !== 'test') {
      process.exit(0);
    }
    return result;
  }).catch(function (e) {
    console.log('Sorry, there is an error:', e);
    console.log('Please check your options and the accessibility of your site or directory permissions');
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  });
};