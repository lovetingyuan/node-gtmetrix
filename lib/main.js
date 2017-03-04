'use strict';

var path = require('path');
var fs = require('fs');
var got = require('got');
var opn = require('opn');
var mkdirp = require('mkdirp');

var _require = require('./enum'),
    BASEURL = _require.BASEURL;

var fetchReportUrl = require('./reporter');

function downloadPdf(reportUrl, program) {
  return new Promise(function (resolve, reject) {
    var pdfPath = program.pdf === true ? './' : program.pdf;
    try {
      var pdfUrl = reportUrl + '/pdf?full=1';
      var timestr = new Date().toISOString().replace(/:/g, '.');
      var hostname = pdfUrl.match(new RegExp(BASEURL + 'reports/(.+?)/'))[1];
      var fileName = hostname + '_' + timestr + '.pdf';
      mkdirp.sync(path.resolve(pdfPath));
      var pdfFilePath = path.resolve(pdfPath, fileName);
      console.log('downloading the reporter, please wait a moment...');
      var pdfWriteStream = fs.createWriteStream(pdfFilePath);
      var duplexStream = got.stream(pdfUrl).pipe(pdfWriteStream);
      duplexStream.on('error', reject).on('close', function () {
        console.log('reporter is saved to', pdfFilePath);
        resolve(program.open ? opn(pdfFilePath) : pdfFilePath);
      });
    } catch (e) {
      reject(e);
    }
  });
}

function startTest(addr, program) {
  return fetchReportUrl(addr).then(function (reportUrl) {
    if (program.browser) {
      if (program.open) {
        return opn(reportUrl);
      }
      console.log('please visit ' + reportUrl + ', thanks!');
      return reportUrl;
    }
    if (program.pdf) {
      return downloadPdf(reportUrl, program);
    }
    return reportUrl;
  });
}

module.exports = startTest;