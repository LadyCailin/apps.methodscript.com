
import http = require('http');
const hostname: string = 'localhost';
const port: number = 8080;

const server = http.createServer((req, res) => {
	console.log("Got request from " + req.headers['x-forwarded-for'] + " to " + req.url);
	// console.log(req);
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.end('Hello ' + req.url + '!\n');
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}!`);
});
