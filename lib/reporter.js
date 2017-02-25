'use strict';

var got = require('got');

var _require = require('./enum'),
    BASEURL = _require.BASEURL;

function getJobId(url) {
  return got.post(BASEURL + 'analyze.html', {
    body: { url: url }
  }).then(function (response) {
    var result = response.body.match(/job_id[ ='"]+([a-zA-Z0-9]{8})/);
    var jobId = result && result[1];
    if (!jobId) {
      return Promise.reject(new Error('can\'t get job_id'));
    }
    // else
    //   console.log('jobid is ', jobId)
    return jobId;
  });
}

function getReportUrl(jobId) {
  var getP = function getP(callback) {
    return got.get(BASEURL + 'job-status/' + jobId, {
      json: true,
      query: {
        _: Date.now()
      }
    }).then(function (response) {
      var data = response.body;
      if (data.finished) {
        callback(null, data.report_url);
      } else if (data.error) {
        callback(data.error);
      } else {
        getP(callback);
      }
    }).catch(function (e) {
      return callback(e);
    });
  };
  return new Promise(function (resolve, reject) {
    console.log('testing your site, please wait a few minutes...');
    getP(function (err, reportUrl) {
      if (err) reject(err);else resolve(reportUrl);
    });
  });
}

module.exports = function fetchReportUrl(customUrl) {
  return getJobId(customUrl).then(function (jobId) {
    return getReportUrl(jobId);
  });
};