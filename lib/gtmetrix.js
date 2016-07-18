/**
 * 获取一个站点的性能分析报告，包括YSlow和PageSpeed
 * @param  {string}   url      表示待测试的站点完整地址
 * @param  {Function} callback 获取到报告之后的回调函数，参数为报告文件名称
 * @return {NA}            无返回值
 */
module.exports = function(url, callback) {
    'use strict';
    var intervalHandler; // 表示轮询key的计时器
    var https = require('https');
    var querystring = require('querystring');
    var postData = querystring.stringify({
        'url': url
    });
    var done = false; // 表示报告文件是否开始下载
    var success = false; // 表示key有没有成功获取到
    var postConfig = {
        host: 'gtmetrix.com',
        method: 'POST',
        path: '/analyze.html',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        }
    };
    var req = https.request(postConfig, function(res) {
        res.setEncoding('utf8');
        var response = '';
        res.on('data', function(chunk) {
            response += chunk;
        });
        res.on('end', function() {
            response.substr(response.indexOf('job_id')).match(/'([\dA-Za-z]+?)'/);
            var jobId = RegExp.$1;
            intervalHandler = setInterval(function() {
            	if(success) {
            		clearInterval(intervalHandler);
            		return;
            	}
                requestForKey(jobId, function(reportAddr, pdfType) {
                    if (done) {
                        return;
                    }
                    done = true;
                    var fs = require('fs');
                    var hostname = require('url').parse(url).hostname;
                    var nowTime = new Date().toISOString().replace(/:/g, '');
                    var fileName = 'GTmetrix-report-' + hostname + '-' + nowTime + '.pdf';
                    var writestream = fs.createWriteStream(fileName);
                    https.get(reportAddr + pdfType, function(res) {
                        writestream.on('close', function() {
                            callback && callback(reportAddr, fileName);
                        });
                        res.pipe(writestream);
                    });
                });
            }, 1000);
        });
    });
    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
    req.write(postData);
    req.end();

    function requestForKey(key, callback) {
        if (success) {
            clearInterval(intervalHandler);
            return;
        }
        https.get("https://gtmetrix.com/job-status/" + key + "?_=" + (+new Date), function(res) {
            res.setEncoding('utf8');
            var response = '';
            res.on('data', function(chunk) {
                response += chunk;
            });
            res.on('end', function() {
                response = JSON.parse(response);
                if (response.report_url) {
                    clearInterval(intervalHandler);
                    success = true;
                    callback(response.report_url, '/pdf?full=1');
                }
            });
        }).on('error', function(e) {
            clearInterval(intervalHandler);
            console.log("Got error: " + e.message);
        });
    }
}
