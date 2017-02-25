'use strict';

var http = require('http');
var serveStatic = require('serve-static');
var localtunnel = require('localtunnel');
var finalhandler = require('finalhandler');

function startTunnel(port) {
  return new Promise(function (resolve, reject) {
    var tunnelConnection = localtunnel(port, function (err, tunnel) {
      if (err) {
        reject(err);
      } else {
        console.log('the tunnel url is ', tunnel.url);
        resolve(tunnel.url);
      }
    });
    tunnelConnection.on('error', reject);
  });
}

function startServer() {
  var rootRath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : './';

  return new Promise(function (resolve, reject) {
    console.log('serve from ', rootRath);
    var serve = serveStatic(rootRath);
    var server = http.createServer(function (req, res) {
      serve(req, res, finalhandler(req, res));
    });
    server.on('listening', function () {
      resolve(server.address().port);
    });
    server.on('error', reject);
    server.listen(0, '127.0.0.1');
  });
}

module.exports = {
  startServer: startServer,
  startTunnel: startTunnel
};