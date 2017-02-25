const program = require('commander');
const pkg = require('../package');
const path = require('path');

program
  .version(pkg.version)
  .command('gtmetrix')
  .description(pkg.description)
  .option('-r, --remote <url>', 'will test the given [url]',
    /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)
  .option('-p, --port [port]', 'will test http://localhost:[port]', /^\d+$/)
  .option('-d, --dir [dirname]', 'will serve from [dirname] as a http root path and do test')
  .option('-b, --browser', 'show the reporter in default browser')
  .option('-f, --pdf [output_path]', 'download and save the reporter pdf file to [output_path] and open it acquiescently')
  .option('-n, --no-open', 'do not open browser or pdf automatically, used with option \'-p\'')
  .parse(process.argv);

if (program.args.length) {
  program.outputHelp();
  process.exit(1);
}

module.exports = program;
