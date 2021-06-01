'use strict';

const Builds = require('../src/api/Builds');



/**
 * Provides a list of builds of the specified artifact available for download
 *
 * artifact String The artifact type to list builds for
 * returns String
 **/
exports.buildsArtifactGET = async function(artifact) {
	return new Promise(async function(resolve, reject) {
		if(Builds.buildsArtifactGET) {
			let apiResult = Builds.buildsArtifactGET(artifact);
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
 * Downloads a specific build
 *
 * artifact String The artifact type to download
 * id String The previously obtained id of the build you wish to download
 * returns byte[]
 **/
exports.buildsArtifactIdGET = async function(artifact,id) {
	return new Promise(async function(resolve, reject) {
		if(Builds.buildsArtifactIdGET) {
			let apiResult = Builds.buildsArtifactIdGET(artifact,id);
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
 * Provides a list of artifact types available for download
 *
 * returns String
 **/
exports.buildsGET = async function() {
	return new Promise(async function(resolve, reject) {
		if(Builds.buildsGET) {
			let apiResult = Builds.buildsGET();
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

