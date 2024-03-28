'use strict';

const utils = require('../utils/writer.js');
const Builds = require('../service/BuildsService');

module.exports.buildsArtifactGet = async function buildsArtifactGet (req, res, next, artifact) {
	Builds.buildsArtifactGet(artifact)
		.then(function (response) {
			utils.writeResponse(res, response.response, response.code, response.contentType, response.headers);
		})
		.catch(function (response) {
			utils.writeResponse(res, response.response, response.code);
		});
};

module.exports.buildsArtifactIdGet = async function buildsArtifactIdGet (req, res, next, artifact, id) {
	Builds.buildsArtifactIdGet(artifact, id)
		.then(function (response) {
			utils.writeResponse(res, response.response, response.code, response.contentType, response.headers);
		})
		.catch(function (response) {
			utils.writeResponse(res, response.response, response.code);
		});
};

module.exports.buildsGet = async function buildsGet (req, res, next) {
	Builds.buildsGet()
		.then(function (response) {
			utils.writeResponse(res, response.response, response.code, response.contentType, response.headers);
		})
		.catch(function (response) {
			utils.writeResponse(res, response.response, response.code);
		});
};
