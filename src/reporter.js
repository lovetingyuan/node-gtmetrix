const got = require('got');
const { BASEURL, HEADERS } = require('./enum');

function getJobId(url) {
  return got.post(`${BASEURL}analyze.html`, {
    body: { url },
    headers: HEADERS,
  }).then((response) => {
    const result = response.body.match(/job_id[ ='"]+([a-zA-Z0-9]{8})/);
    const jobId = result && result[1];
    if (!jobId) {
      return Promise.reject(new Error('can\'t get job_id'));
    }
    // else
    //   console.log('jobid is ', jobId)
    return jobId;
  });
}

function getReportUrl(jobId) {
  const getP = callback => got(`${BASEURL}job-status/${jobId}`, {
    json: true,
    query: {
      _: Date.now(),
    },
    timeout: 30000,
    headers: HEADERS,
  }).then((res) => {
    const data = res.body;
    if (data.finished) {
      callback(null, data.report_url);
    } else if (data.error) {
      callback(data.error);
    } else if (!('finished' in data)) {
      callback(new Error('failed to get report with unknown reason'));
    } else {
      getP(callback);
    }
  }).catch(e => callback(e));
  return new Promise((resolve, reject) => {
    console.log('testing your site, please wait a few minutes...');
    getP((err, reportUrl) => {
      if (err) reject(err);
      else resolve(reportUrl);
    });
  });
}

module.exports = function fetchReportUrl(customUrl) {
  return getJobId(customUrl)
    .then(jobId => getReportUrl(jobId));
};
