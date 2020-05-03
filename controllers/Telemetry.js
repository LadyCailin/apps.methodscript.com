'use strict';

const utils = require('../utils/writer.js');
const Telemetry = require('../service/TelemetryService');

module.exports.telemetryGET = function telemetryGET (req, res, next) {
	Telemetry.telemetryGET()
		.then(function (response) {
			utils.writeResponse(res, response.response, response.code, response.contentType);
		})
		.catch(function (response) {
			utils.writeResponse(res, response.response, response.code);
		});
};

module.exports.telemetryKeyPOST = function telemetryKeyPOST (req, res, next, body, key) {
	Telemetry.telemetryKeyPOST(body, key)
		.then(function (response) {
			utils.writeResponse(res, response.response, response.code, response.contentType);
		})
		.catch(function (response) {
			utils.writeResponse(res, response.response, response.code);
		});
};
