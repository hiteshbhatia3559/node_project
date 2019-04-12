var http = require('http');
var ip = '172.16.100.99';
var port = 8888;
var value;

let request = require('request');
let fs = require('fs');

let query1 = 'http://172.16.100.227:8086/query?db=trade&q=SELECT mean("buyValuePos") AS "mean_buyValuePos", mean("sellValuePos") AS "mean_sellValuePos" FROM "trade"."autogen"."UserTradePositionInfo" WHERE time > now() - 12h and "instrument_type"=\'"XX"\' GROUP BY time(1d), expiry, underlying';
// let query2 = 'http://172.16.100.227:8086/query?db=trade&q=SELECT mean("buyValuePos") AS "mean_buyValuePos", mean("sellValuePos") AS "mean_sellValuePos" FROM "trade"."autogen"."UserTradePositionInfo" WHERE time > now() - 12h and "instrument_type"=\'"XX"\' GROUP BY time(1h), expiry, underlying';


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
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.writeHead(200, {'Content-Type': 'text/html'});
    arraytowrite = [];
    value.forEach(function (item) {
        // res.write(JSON.stringify({item["columns"][0]:item["values"][1][0]}));
        value_to_write = {};
        value_to_write["time"] = item["values"][1][0];
        value_to_write["underlying"] = item["tags"]["underlying"];
        value_to_write["NetTradedValue"] = item["values"][1][1] + item["values"][1][2];
        arraytowrite.push(value_to_write)
    });
    res.write(JSON.stringify(arraytowrite));
    var fs = require('fs');
    fs.writeFile('data.json',JSON.stringify(arraytowrite),'utf8',function(err, result) {
     if(err) console.log('error', err);
   });

    // res.write("]");
}).listen(port, ip);


console.log('Server running at http://' + ip + ':' + port);