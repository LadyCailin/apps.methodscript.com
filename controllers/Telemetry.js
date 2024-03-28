'use strict';

const utils = require('../utils/writer.js');
const Telemetry = require('../service/TelemetryService');

module.exports.telemetryGet = async function telemetryGet (req, res, next) {
	Telemetry.telemetryGet()
		.then(function (response) {
			utils.writeResponse(res, response.response, response.code, response.contentType, response.headers);
		})
		.catch(function (response) {
			utils.writeResponse(res, response.response, response.code);
		});
};

module.exports.telemetryKeyPost = async function telemetryKeyPost (req, res, next, body, key) {
	Telemetry.telemetryKeyPost(body, key)
		.then(function (response) {
			utils.writeResponse(res, response.response, response.code, response.contentType, response.headers);
		})
		.catch(function (response) {
			utils.writeResponse(res, response.response, response.code);
		});
};
