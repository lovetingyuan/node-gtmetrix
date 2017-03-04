const path = require('path');
const fs = require('fs');
const got = require('got');
const opn = require('opn');
const mkdirp = require('mkdirp');
const { BASEURL } = require('./enum');
const fetchReportUrl = require('./reporter');

function downloadPdf(reportUrl, program) {
  return new Promise((resolve, reject) => {
    const pdfPath = program.pdf === true ? './' : program.pdf;
    try {
      const pdfUrl = `${reportUrl}/pdf?full=1`;
      const timestr = new Date().toISOString().replace(/:/g, '.');
      const hostname = pdfUrl.match(new RegExp(`${BASEURL}reports\/(.+?)\/`))[1];
      const fileName = `${hostname}_${timestr}.pdf`;
      mkdirp.sync(path.resolve(pdfPath));
      const pdfFilePath = path.resolve(pdfPath, fileName);
      console.log('downloading the reporter, please wait a moment...');
      const pdfWriteStream = fs.createWriteStream(pdfFilePath);
      const duplexStream = got.stream(pdfUrl).pipe(pdfWriteStream);
      duplexStream.on('error', reject).on('close', () => {
        console.log('reporter is saved to', pdfFilePath);
        resolve(program.open ? opn(pdfFilePath) : pdfFilePath);
      });
    } catch (e) {
      reject(e);
    }
  });
}

function startTest(addr, program) {
  return fetchReportUrl(addr)
    .then((reportUrl) => {
      if (program.browser) {
        if (program.open) {
          return opn(reportUrl);
        }
        console.log(`please visit ${reportUrl}, thanks!`);
        return reportUrl;
      }
      if (program.pdf) {
        return downloadPdf(reportUrl, program);
      }
      return reportUrl;
    });
}

module.exports = startTest;
