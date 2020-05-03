'use strict';

const Meta = require('../src/api/Meta');



/**
 * Pings the server to check its status
 *
 * returns String
 **/
exports.pingGET = function() {
	return new Promise(function(resolve, reject) {
		if(Meta.pingGET) {
			const apiResult = Meta.pingGET();
			if(typeof apiResult === "object") {
				const result = apiResult.payload;
				const code = apiResult.code || 200;
				const contentType = apiResult.contentType || (typeof result === "object" ? 'application/json' : 'text/plain');
				resolve({response: result, code, contentType});
			} else {
				resolve({response: apiResult, code: 200});
			}
		} else {
			reject({response: "Not Implemented Yet", code: 501 });
		}
	});
}



/**
 * List services on this server
 * Lists the services that are available on this server. In general, clients must load this page first to determine supported services, and ensure that graceful fallbacks are provided if expected services are missing.
 *
 * returns List
 **/
exports.rootGET = function() {
	return new Promise(function(resolve, reject) {
		if(Meta.rootGET) {
			const apiResult = Meta.rootGET();
			if(typeof apiResult === "object") {
				const result = apiResult.payload;
				const code = apiResult.code || 200;
				const contentType = apiResult.contentType || (typeof result === "object" ? 'application/json' : 'text/plain');
				resolve({response: result, code, contentType});
			} else {
				resolve({response: apiResult, code: 200});
			}
		} else {
			reject({response: "Not Implemented Yet", code: 501 });
		}
	});
}

