'use strict';

const utils = require('../utils/writer.js');
const Meta = require('../service/MetaService');

module.exports.pingGET = async function pingGET (req, res, next) {
	Meta.pingGET()
		.then(function (response) {
			utils.writeResponse(res, response.response, response.code, response.contentType, response.headers);
		})
		.catch(function (response) {
			utils.writeResponse(res, response.response, response.code);
		});
};

module.exports.rootGET = async function rootGET (req, res, next) {
	Meta.rootGET()
		.then(function (response) {
			utils.writeResponse(res, response.response, response.code, response.contentType, response.headers);
		})
		.catch(function (response) {
			utils.writeResponse(res, response.response, response.code);
		});
};
