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

app.use(cors({ origin: CORS }));

// This is a hack to work around https://github.com/bug-hunters/oas3-tools/issues/41
// The project appears abandoned though, and may require migration away from.
// https://www.npmjs.com/package/express-openapi is potentially an option.
const numberOfCustomMiddlewares = 1;
const stack = app._router.stack;
const lastEntries = stack.splice(app._router.stack.length - numberOfCustomMiddlewares);
const firstEntries = stack.splice(0, 5);
app._router.stack = [...firstEntries, ...lastEntries, ...stack];

http.createServer(app).listen(serverPort, function () {
	console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
	console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});





