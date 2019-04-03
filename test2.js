var http = require('http');
var ip = '172.16.100.99';
var port = 8888;
var value;

let request = require('request');
let fs = require('fs');

let query1 = 'http://172.16.100.227:8086/query?db=trade&q=SELECT mean("buyValuePos") AS "mean_buyValuePos", mean("sellValuePos") AS "mean_sellValuePos" FROM "trade"."autogen"."UserTradePositionInfo" WHERE time > now() - 12h and "instrument_type"=\'"XX"\' GROUP BY time(1d), expiry, underlying';
let query2 = 'http://172.16.100.227:8086/query?db=trade&q=SELECT mean("buyValuePos") AS "mean_buyValuePos", mean("sellValuePos") AS "mean_sellValuePos" FROM "trade"."autogen"."UserTradePositionInfo" WHERE time > now() - 12h and "instrument_type"=\'"XX"\' GROUP BY time(1h), expiry, underlying';


request(query1,
    {json: true}, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        value = body['results'][0]['series'];
        let data = JSON.stringify(value);
        fs.writeFileSync('./data/saved.json', data);
    });

http.createServer(function (req, res) {
    res.writeHead(200,{'Content-Type': 'text/html'});
    res.write(JSON.stringify(value))
}).listen(port, ip);

console.log('Server running at http://' + ip + ':' + port);