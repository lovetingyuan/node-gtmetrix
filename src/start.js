const config = require('./command');
const serve = require('./serve');
const startTest = require('./main');
const path = require('path');

function parseArgs() {
  if (config.remote) {
    return startTest(config.remote);
  }
  if (config.port) {
    return serve.startTunnel(config.port === true ? 80 : config.port)
      .then(url => startTest(url));
  }
  if (config.dir) {
    let rootPath = process.cwd();
    if (typeof config.dir === 'string') {
      rootPath = path.resolve(config.dir);
    }
    return serve.startServer(rootPath)
      .then(port => serve.startTunnel(port))
      .then(url => startTest(url));
  }
  return serve.startServer(process.cwd())
    .then(port => serve.startTunnel(port))
    .then(url => startTest(url));
}

module.exports = function start() {
  parseArgs().then(() => {
    console.log('Thanks for using!');
    process.exit(0);
  }).catch((e) => {
    console.log('Sorry, there is an error:', e);
    console.log('Please check your options and the accessibility of your site or directory permissions');
    process.exit(1);
  });
};
