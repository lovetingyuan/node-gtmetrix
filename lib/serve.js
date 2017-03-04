'use strict';

var http = require('http');
var serveStatic = require('serve-static');
var localtunnel = require('localtunnel');
var finalhandler = require('finalhandler');
var got = require('got');

function startTunnel(port) {
  return new Promise(function (resolve, reject) {
    console.log('generating public url, please wait...');
    var tunnelConnection = localtunnel(port, function (err, tunnel) {
      if (err) {
        reject(err);
      } else {
        setTimeout(function () {
          resolve(got(tunnel.url, {
            timeout: 30000,
            retries: 10
          }).then(function (res) {
            console.log('public url is', res.url);
            return res.url;
          }));
        });
      }
    });
    tunnelConnection.on('error', reject);
  });
}

function startServer() {
  var rootRath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : './';
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return new Promise(function (resolve, reject) {
    var serve = serveStatic(rootRath, opts);
    var server = http.createServer(function (req, res) {
      serve(req, res, finalhandler(req, res));
    });
    server.on('listening', function () {
      var port = server.address().port;
      console.log('serve from', rootRath, 'on port:' + port);
      resolve(port);
    });
    server.on('error', reject);
    server.listen(0, '127.0.0.1');
  });
}

module.exports = {
  startServer: startServer,
  startTunnel: startTunnel
};