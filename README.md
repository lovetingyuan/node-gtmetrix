# node-gtmetrix

基于node的网站性能测试，测试结果基于gtmetrix.com提供的报告

例如如果你想测试站点 [http://tingyuan.me/](http://tingyuan.me/) 的性能，可以使用下面的用法

用法: `node-gtmetrix http://tingyuan.me/`

bug 反馈 email to： <1932294867@qq.com>

node 用法:
```javascript
var gtmetrix = require('node-gtmetrix');
var url = 'http://tingyuan.me/';
gtmetrix(url, function(reportUrl, reportFilePath) {
	console.log(arguments);
});
```