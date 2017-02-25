'use strict';

var path = require('path');
var fs = require('fs');
var got = require('got');
var opn = require('opn');
var mkdirp = require('mkdirp');
var enums = require('./enum');

function downloadPdf(reportUrl) {
  var pdfUrl = reportUrl + 'pdf?full=1';
  var timestr = new Date().toISOString().replace(/:/g, '.');
  var hostname = pdfUrl.match(new RegExp(enums.BASEURL + 'reports\/(.+?)\/'))[1];
  var fileName = hostname + '_' + timestr + '.pdf';
  var pdfPath = path.resolve(fileName);
  var config = enums.getConfig();

  return new Promise(function(resolve, reject) {
    if (typeof config.pdf === 'string') {
      try {
        mkdirp.sync(path.resolve(config.pdf))
      } catch(e) {
        reject(e)
      }
      pdfPath = path.resolve(config.pdf, fileName);
    }
    var pdfWriteStream = fs.createWriteStream(pdfPath);
    var duplexStream = got.stream(pdfUrl).pipe(pdfWriteStream);
    duplexStream.on('error', reject).on('close', function() {
      console.log('the reporter is saved to ' + pdfPath);
      resolve(config.open ? opn(pdfPath) : pdfPath);
    });
  });
}

module.exports = downloadPdf;
