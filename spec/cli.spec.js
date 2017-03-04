var base = '../lib';
describe('test cli', function() {
  var originalTimeout;
  beforeAll(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 90000
  })
  it('local directory and open pdf', function(done) {
    var start = require(base + '/start');
    var command = require(base + '/command');
    var fs = require('fs')
    start(command(['node', 'test', '-f', 'spec/report', '-d', 'spec/public', '-n']))
      .then(function(pdfPath) {
        expect(pdfPath).toMatch(/\.pdf$/)
        expect(fs.existsSync(pdfPath)).toBe(true)
        done()
      })
  })
  afterAll(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
  })
})
