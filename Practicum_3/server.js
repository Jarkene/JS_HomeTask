const http = require('http');
const fs = require('fs');

http.createServer(function (req, res) {
    if (decodeURI(req.url).indexOf('/data?') != -1) {
        fs.readFile('items.json', function (err, text) {
            const params = decodeURI(req.url).split('?')[1].split('&').reduce((p, c) => {
                c = c.split('=');
                return Object.assign(p, {
                    [c[0]]: String(c[1]).split(','),
                });
            }, {});
            var result = JSON.parse(text);
            if (params.category) {
                result = result.filter(item => item.category == params.category);
                result = filterItems(result, params);
            }
            res.writeHead(200, {
                "Content-Type": "text/plain; charset=utf-8",
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
            });
            res.write(JSON.stringify(result));
            res.end();
        })
    }
}).listen(8080);

function filterItems(items, params) {
    console.log(params);
    Object.keys(params).map(param => {
        if (param != 'category' && params[param] != '') {
            var values = params[param];
            items = items.filter(item => {
                console.log(values.some(value => value == item.props[param]));
                return values.some(value => value == item.props[param]);
            });

        }
    })
    return items;
}