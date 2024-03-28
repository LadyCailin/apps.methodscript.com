'use strict';

const utils = require('../utils/writer.js');
const Meta = require('../service/MetaService');

module.exports.pingGet = async function pingGet (req, res, next) {
	Meta.pingGet()
		.then(function (response) {
			utils.writeResponse(res, response.response, response.code, response.contentType, response.headers);
		})
		.catch(function (response) {
			utils.writeResponse(res, response.response, response.code);
		});
};

module.exports.rootGet = async function rootGet (req, res, next) {
	Meta.rootGet()
		.then(function (response) {
			utils.writeResponse(res, response.response, response.code, response.contentType, response.headers);
		})
		.catch(function (response) {
			utils.writeResponse(res, response.response, response.code);
		});
};
