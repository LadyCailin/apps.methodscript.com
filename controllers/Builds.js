'use strict';

const utils = require('../utils/writer.js');
const Builds = require('../service/BuildsService');

module.exports.buildsArtifactGET = async function buildsArtifactGET (req, res, next, artifact) {
	Builds.buildsArtifactGET(artifact)
		.then(function (response) {
			utils.writeResponse(res, response.response, response.code, response.contentType, response.headers);
		})
		.catch(function (response) {
			utils.writeResponse(res, response.response, response.code);
		});
};

module.exports.buildsArtifactIdGET = async function buildsArtifactIdGET (req, res, next, artifact, id) {
	Builds.buildsArtifactIdGET(artifact, id)
		.then(function (response) {
			utils.writeResponse(res, response.response, response.code, response.contentType, response.headers);
		})
		.catch(function (response) {
			utils.writeResponse(res, response.response, response.code);
		});
};

module.exports.buildsGET = async function buildsGET (req, res, next) {
	Builds.buildsGET()
		.then(function (response) {
			utils.writeResponse(res, response.response, response.code, response.contentType, response.headers);
		})
		.catch(function (response) {
			utils.writeResponse(res, response.response, response.code);
		});
};
