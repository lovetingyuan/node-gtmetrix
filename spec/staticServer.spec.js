var base = '../lib';
describe('test get reportUrl of a public url', function() {
  var fs = require('fs')
  var mkdirp = require('mkdirp')
  var originalTimeout;
  beforeAll(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000
  })
  var serve = require(base + '/serve')
  var got = require('got')
  it('test serve static site spec', function(done) {
    var pageContent = 'hello world, I love you, wyh ' + (new Date()).toLocaleString()
    mkdirp.sync('spec/public')
    fs.writeFileSync('spec/public/index.html', pageContent)
    serve.startServer('spec/public').then(function(port) {
      return got('http://localhost:' + port)
    }).then(function(res) {
      expect(res.body).toBe(pageContent)
      done()
    }).catch(function(e) {
      done(e)
    })
  })

  it('test local tunnel NAT spec', function(done) {
    var pageContent = [process.cwd(), process.platform, Date.now()].join('_')
    mkdirp.sync('spec/public')
    fs.writeFileSync('spec/public/index2.html', pageContent)
    serve.startServer('spec/public', {
      index: 'index2.html'
    }).then(function(port) {
      return serve.startTunnel(port)
    }).then(function(tunnelUrl) {
      return new Promise(function(resolve) {
        setTimeout(function() {
          resolve(got(tunnelUrl))
        }, 5000)
      })
    }).then(function(res) {
      expect(tunnelUrl).toMatch(/^https:\/\/[a-z]{10}\/localtunnel\.me$/)
      expect(res.body).toBe(pageContent)
      done()
    }).catch(function(e) {
      done(e)
    })
  })
  afterAll(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
  })
})
