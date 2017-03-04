const command = require('./command');
const serve = require('./serve');
const startTest = require('./main');
const path = require('path');

function parseArgs(config) {
  if (config.remote) {
    return startTest(config.remote, config);
  }
  if (config.port) {
    return serve.startTunnel(config.port === true ? 80 : config.port)
      .then(url => startTest(url, config));
  }
  if (config.dir) {
    let rootPath = process.cwd();
    if (typeof config.dir === 'string') {
      rootPath = path.resolve(config.dir);
    }
    return serve.startServer(rootPath)
      .then(port => serve.startTunnel(port))
      .then(url => startTest(url, config));
  }
  return serve.startServer(process.cwd())
    .then(port => serve.startTunnel(port))
    .then(url => startTest(url, config));
}

module.exports = function start(_program) {
  const program = _program || command();

  return parseArgs(program).then((result) => {
    console.log('Thanks for using!');
    if (process.env.NODE_ENV !== 'test') { process.exit(0); }
    return result;
  }).catch((e) => {
    console.log('Sorry, there is an error:', e);
    console.log('Please check your options and the accessibility of your site or directory permissions');
    if (process.env.NODE_ENV !== 'test') { process.exit(1); }
  });
};
