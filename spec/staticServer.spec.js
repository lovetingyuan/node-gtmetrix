var base = '../lib';
describe('test get reportUrl of a public url', function() {
  var fs = require('fs')
  var mkdirp = require('mkdirp')
  var originalTimeout;
  beforeAll(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000
  })
  var serve = require(base + '/serve')
  var got = require('got')
  it('test serve static site spec', function(done) {
    var pageContent = 'hello world, I love you, wyh ' + (new Date).toLocaleString()
    mkdirp.sync('spec/public')
    fs.writeFileSync('spec/public/index.html', pageContent)
    serve.startServer('public').then(function(port) {
      return got('http://localhost:' + port + '?_t' + Date.now())
    }).then(function(res) {
      console.log('--' + res.body + '---')
      expect(res.body).toBe(pageContent)
      done()
    }).catch(function(e) {
      console.log(555, e)
    })
  })

  xit('test local tunnel NAT spec', function(done) {
    var pageContent = process.cwd() + process.platform
    mkdirp.sync('spec/public2')
    fs.writeFileSync('spec/public2/index.html', pageContent)
    serve.startServer('public2').then(function(port) {
      return serve.startTunnel(port)
    }).then(function(tunnelUrl) {
      console.log(tunnelUrl)
      return got(tunnelUrl, {timeout: 50000})
    }).then(function(res) {
      expect(tunnelUrl).toMatch(/^https:\/\/[a-z]{10}\/localtunnel\.me$/)
      expect(res.body).toBe(pageContent)
      done()
    }).catch(function(e) {
      console.log(444, e)
    })
  })
  afterAll(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
  })
})
