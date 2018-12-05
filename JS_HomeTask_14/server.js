const http = require('http');
const fs = require('fs');

const server = http.createServer(function (req, res) {
    if (req.url.indexOf('/data?') != -1) {
        const params = req.url.split('?')[1].split('&').reduce((p, c) => {
            c = c.split('=');
            return Object.assign(p, {
                [c[0]]: c[1],
            });
        }, {});
        if (params.max == 0) params.max = 2000;
        fs.readFile('items.json', function (err, text) {
            let result = JSON.parse(text);
            if (params.min) {
                result = result.filter(item => +item.price >= params.min);
            }
            if (params.max) {
                result = result.filter(item => +item.price <= params.max);
            }
            if (params.category) {
                result = result.filter(item => item.category == params.category);
            }
            res.writeHead(200, {
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
            });
            res.write(JSON.stringify(result), 'utf-8');
            res.end();
        })
    }
}).listen(8080);