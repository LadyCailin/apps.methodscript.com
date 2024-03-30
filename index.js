'use strict';

var path = require('path');
var http = require('http');
var oas3Tools = require('oas3-tools');
var cors = require('cors')

var serverPort = 8080;

// swaggerRouter configuration
var options = {
	routing: {
		controllers: path.join(__dirname, './controllers')
	}
};

var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
var app = expressAppConfig.getApp();

var CORS = [
	'https://methodscript.com',
	'http://localhost:8080',
	'http://127.0.0.1:8080'
];

if(process.argv && process.argv[2] === "local-start") {
	console.log("Allowing CORS requests from localhost");
	CORS.push('http://localhost:3001');
	CORS.push('http://127.0.0.1:3001');
}

app.options('*', cors(function (req, callback) {
	var corsOptions = { origin: false };
	if(CORS.indexOf(req.header('Origin')) !== -1) {
		// res.setHeader('Access-Control-Allow-Origin', req.header('Origin'));
		corsOptions = { origin: true };
	}
	callback(null, corsOptions);
}));

// app.use(function (req, res, next) {
// 	if(CORS.indexOf(req.header('Origin')) !== -1) {
// 		res.setHeader('Access-Control-Allow-Origin', req.header('Origin'));
// 	}
// 	next();
// });

// Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function () {
	console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
	console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});





