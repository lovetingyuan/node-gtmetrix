var base = '../lib';
describe('test get reportUrl of a public url', function() {
  var originalTimeout;
  beforeAll(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000
  })
  var fetchReportUrl = require(base + '/reporter')
  var BASEURL = require(base + '/enum').BASEURL
  it('test google.com spec', function(done) {
    fetchReportUrl('https://google.com').then(function(reportUrl) {
      expect(reportUrl).toMatch(new RegExp('^' + BASEURL + 'reports\/google\.com\/[a-zA-Z0-9]{8}$'))
      done()
    })
  })
  it('test tingyuan.me spec', function(done) {
    fetchReportUrl('http://tingyuan.me').then(function(reportUrl) {
      expect(reportUrl).toMatch(new RegExp('^' + BASEURL + 'reports\/tingyuan\.me\/[a-zA-Z0-9]{8}$'))
      done()
    })
  })
  afterAll(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
  })
})
