(function() {
	'use strict';
	var gtmetrix = require('./lib/gtmetrix');
	console.log(process.argv);
    console.log('Getting a test report, please wait...');
	gtmetrix('https://baidu.com', function(file) {
		console.log('done! the report is ' + file);
	});
})();