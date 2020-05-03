'use strict';

const Telemetry = require('../src/api/Telemetry');



/**
 * Obtains a telemetry key, which is used for future requests
 *
 * returns String
 **/
exports.telemetryGET = function() {
	return new Promise(function(resolve, reject) {
		if(Telemetry.telemetryGET) {
			const apiResult = Telemetry.telemetryGET();
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
 * Submits a telemetry event.
 * Submits a telemetry event, which is forwarded to the Application Insights application.
 *
 * body String The telemetry event. The content should be text/plain, even though it will actually be json, as server merely forwards the content on to ApplicationInsights.
 * key String The previously obtained key
 * no response value expected for this operation
 **/
exports.telemetryKeyPOST = function(body,key) {
	return new Promise(function(resolve, reject) {
		if(Telemetry.telemetryKeyPOST) {
			const apiResult = Telemetry.telemetryKeyPOST(body,key);
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

