'use strict';

var program = require('commander');
var pkg = require('../package');

var config = null;

function getCommandConfig(args) {
  if (config) {
    return config;
  }
  var prog = program.version(pkg.version);
  if (process.env.NODE_ENV !== 'test') {
    prog = prog.command('gtmetrix');
  }
  prog.description(pkg.description).option('-r, --remote <url>', 'will test the given [url]', /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/).option('-p, --port [port]', 'will test http://localhost:[port]', /^\d+$/).option('-d, --dir [dirname]', 'will serve from [dirname] as a http root path and do test').option('-b, --browser', 'show the reporter in default browser').option('-f, --pdf [output_path]', 'download and save the reporter pdf file to [output_path] and open it acquiescently').option('-n, --no-open', 'do not open browser or pdf automatically, used with option \'-p\'').parse(args || process.argv);

  if (program.args && program.args.length) {
    program.outputHelp();
    process.exit(1);
  }
  return config = program;
}

module.exports = getCommandConfig;