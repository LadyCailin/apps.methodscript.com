'use strict';

const Meta = require('../src/api/Meta');



/**
 * Pings the server to check its status.
 *
 * returns String
 **/
exports.pingGet = async function() {
	return new Promise(async function(resolve, reject) {
		if(Meta.pingGet) {
			let apiResult = Meta.pingGet();
			if(typeof apiResult === "object") {
				if(apiResult.then) {
					apiResult = await apiResult;
				}
				const result = apiResult.payload;
				const code = apiResult.code || 200;
				const contentType = apiResult.contentType || (typeof result === "object" ? 'application/json' : 'text/plain');
				resolve({ response: result, code, contentType, headers: apiResult.getHeaders() });
			} else {
				resolve({ response: apiResult, code: 200});
			}
		} else {
			reject({ response: "Not Implemented Yet", code: 501 });
		}
	});
}



/**
 * List services on this server.
 * Lists the services that are available on this server. In general, clients must load this page first to determine supported services, and ensure that graceful fallbacks are provided if expected services are missing.
 *
 * returns List
 **/
exports.rootGet = async function() {
	return new Promise(async function(resolve, reject) {
		if(Meta.rootGet) {
			let apiResult = Meta.rootGet();
			if(typeof apiResult === "object") {
				if(apiResult.then) {
					apiResult = await apiResult;
				}
				const result = apiResult.payload;
				const code = apiResult.code || 200;
				const contentType = apiResult.contentType || (typeof result === "object" ? 'application/json' : 'text/plain');
				resolve({ response: result, code, contentType, headers: apiResult.getHeaders() });
			} else {
				resolve({ response: apiResult, code: 200});
			}
		} else {
			reject({ response: "Not Implemented Yet", code: 501 });
		}
	});
}

