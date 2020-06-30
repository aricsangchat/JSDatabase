const fs = require('fs');
const https = require('https');
const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  };
const hostname = '127.0.0.1';
const port = 8000;

let database,
    rawData;

// fs.readFile('database.json', 'utf8', (err, data) => {
//     if (err) throw err;
//     console.log(data)
//     database = JSON.parse(data);
//     console.log(JSON.parse(data));
//     // fs.writeFile(`database-${new Date().getTime()}.json`, data, 'utf8', (err) => {
//     //     if (err) throw err;
//     //     console.log('The file has been saved!');
//     // });
// });

database = JSON.parse(fs.readFileSync('database.json'));

const server = https.createServer(options, function (req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    fs.readFile("index.html", 'utf8',function (error, pgResp) {
        if (error) {
            res.writeHead(404);
            res.write('Contents you are looking are Not Found');
        } else {
            console.log(pgResp);
            console.log(pgResp.indexOf('Hello!'), pgResp.length);
            // pgResp.splice(pgResp.indexOf('Hello!'), 0, function(){
            //     for (x in database) {
            //         "<tr><td>" + database[x].name + "</td></tr>";
            //     }
            // })
            
            let str1 = pgResp.slice(0, pgResp.indexOf('<table>') + 7);
            let str2 = pgResp.slice(pgResp.indexOf('<table>') + 7, pgResp.length);
            console.log(str2);
            for (x in database) {
                //console.log(database[x]);
                str1 = str1.concat("<tr><td>" + database[x] + "</td></tr>");
                //console.log(str1);
            }
            str1 = str1.concat(str2);
            console.log(str1);

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(str1);
        }
         
        res.end();
    });
    //res.end(database);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});