'use strict';

var utils = require('../utils/writer.js');
var Meta = require('../service/MetaService');

module.exports.pingGET = function pingGET (req, res, next) {
	Meta.pingGET()
		.then(function (response) {
			utils.writeResponse(res, response.response, response.code, response.contentType);
		})
		.catch(function (response) {
			utils.writeResponse(res, response.response, response.code);
		});
};

module.exports.rootGET = function rootGET (req, res, next) {
	Meta.rootGET()
		.then(function (response) {
			utils.writeResponse(res, response.response, response.code, response.contentType);
		})
		.catch(function (response) {
			utils.writeResponse(res, response.response, response.code);
		});
};
