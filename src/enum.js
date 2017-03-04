const BASEURL = 'https://gtmetrix.com/';
const URL = require('url');

exports.BASEURL = BASEURL;
exports.HEADERS = {
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
  referer: BASEURL,
  origin: BASEURL,
  pragma: 'no-cache',
  'cache-control': 'no-cache',
  host: URL.parse(BASEURL).host,
};
