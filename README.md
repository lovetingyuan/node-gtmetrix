## node-gtmetrix

test the speed and performance of your site, based on https://gtmetrix.com/

### install

`npm install -g node-gtmetrix`

### usage
```
Usage: gtmetrix [options]

  Test local site performance and show the result in the browser or a pdf file

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -r, --remote <url>       will test the given [url]
    -p, --port [port]        will test http://localhost:[port]
    -d, --dir [dirname]      will serve from [dirname] as a http root path and do test
    -b, --browser            show the reporter in default browser
    -f, --pdf [output_path]  download and save the reporter pdf file to [output_path] and open it acquiescently
    -n, --no-open            do not open browser or pdf automatically, used with option '-p'
```

### example
* `gtmetrix -r https://google.com -f perf_google` // will test google.com and save the report as a pdf file to ./pref_google
* `gtmetrix -d public -b` // will start a http server at public directory and show the report in browser
* `gtmetrix -p 8080 -fn` // will test http://127.0.0.1:8080 and just download the report pdf file to current path

### license
MIT
