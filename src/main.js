const path = require('path');
const fs = require('fs');
const got = require('got');
const opn = require('opn');
const mkdirp = require('mkdirp');
const { BASEURL } = require('./enum');
const program = require('./command');
const fetchReportUrl = require('./reporter');

function downloadPdf(reportUrl) {
  return new Promise((resolve, reject) => {
    const pdfPath = program.pdf === true ? './' : program.pdf;
    try {
      const pdfUrl = `${reportUrl}/pdf?full=1`;
      const timestr = new Date().toISOString().replace(/:/g, '.');
      const hostname = pdfUrl.match(new RegExp(`${BASEURL}reports\/(.+?)\/`))[1];
      const fileName = `${hostname}_${timestr}.pdf`;
      mkdirp.sync(path.resolve(pdfPath));
      const pdfFilePath = path.resolve(pdfPath, fileName);
      console.log('downloading pdf...', pdfFilePath);
      const pdfWriteStream = fs.createWriteStream(pdfFilePath);
      const duplexStream = got.stream(pdfUrl).pipe(pdfWriteStream);
      duplexStream.on('error', reject).on('close', () => {
        console.log('the reporter is saved to ', pdfFilePath);
        resolve(program.open ? opn(pdfFilePath) : pdfFilePath);
      });
    } catch (e) {
      reject(e);
    }
  });
}

function startTest(addr) {
  return fetchReportUrl(addr)
    .then((reportUrl) => {
      if (program.browser) {
        if (program.open) { return opn(reportUrl); }

        console.log(`please visit ${reportUrl}`);
        return reportUrl;
      }
      if (program.pdf) { return downloadPdf(reportUrl); }
      return reportUrl;
    });
}

module.exports = startTest;
