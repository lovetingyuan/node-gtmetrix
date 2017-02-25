const http = require('http');
const serveStatic = require('serve-static');
const localtunnel = require('localtunnel');
const finalhandler = require('finalhandler');

function startTunnel(port) {
  return new Promise((resolve, reject) => {
    const tunnelConnection = localtunnel(port, (err, tunnel) => {
      if (err) { reject(err); } else {
        console.log('the tunnel url is ', tunnel.url);
        resolve(tunnel.url);
      }
    });
    tunnelConnection.on('error', reject);
  });
}

function startServer(rootRath = './', opts = {}) {
  return new Promise((resolve, reject) => {
    console.log('serve from ', rootRath);
    const serve = serveStatic(rootRath);
    const server = http.createServer((req, res) => {
      serve(req, res, finalhandler(req, res));
    });
    server.on('listening', () => {
      resolve(server.address().port);
    });
    server.on('error', reject);
    server.listen(0, '127.0.0.1');
  });
}

module.exports = {
  startServer,
  startTunnel,
};
