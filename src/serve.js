const http = require('http');
const serveStatic = require('serve-static');
const localtunnel = require('localtunnel');
const finalhandler = require('finalhandler');
const got = require('got');

function startTunnel(port) {
  return new Promise((resolve, reject) => {
    console.log('generating public url, please wait...');
    const tunnelConnection = localtunnel(port, (err, tunnel) => {
      if (err) { reject(err); } else {
        setTimeout(() => {
          resolve(got(tunnel.url, {
            timeout: 30000,
            retries: 10,
          }).then((res) => {
            console.log('public url is', res.url);
            return res.url;
          }));
        });
      }
    });
    tunnelConnection.on('error', reject);
  });
}

function startServer(rootRath = './', opts = {}) {
  return new Promise((resolve, reject) => {
    const serve = serveStatic(rootRath, opts);
    const server = http.createServer((req, res) => {
      serve(req, res, finalhandler(req, res));
    });
    server.on('listening', () => {
      const port = server.address().port;
      console.log('serve from', rootRath, `on port:${port}`);
      resolve(port);
    });
    server.on('error', reject);
    server.listen(0, '127.0.0.1');
  });
}

module.exports = {
  startServer,
  startTunnel,
};
