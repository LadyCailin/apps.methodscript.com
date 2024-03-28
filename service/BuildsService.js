'use strict';

const Builds = require('../src/api/Builds');



/**
 * Provides a list of builds of the specified artifact available for download.
 * Provides a list of builds of the specified artifact available for download. Note that the order of the returned artifacts is arbitrary.
 *
 * artifact String The artifact type to list builds for.
 * returns List
 **/
exports.buildsArtifactGet = async function(artifact) {
	return new Promise(async function(resolve, reject) {
		if(Builds.buildsArtifactGet) {
			let apiResult = Builds.buildsArtifactGet(artifact);
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
 * Downloads a specific build of the specified artifact type.
 *
 * artifact String The artifact type to download
 * id String The previously obtained id of the build you wish to download.
 * returns byte[]
 **/
exports.buildsArtifactIdGet = async function(artifact,id) {
	return new Promise(async function(resolve, reject) {
		if(Builds.buildsArtifactIdGet) {
			let apiResult = Builds.buildsArtifactIdGet(artifact,id);
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
 * Provides a list of artifact types available for download.
 *
 * returns List
 **/
exports.buildsGet = async function() {
	return new Promise(async function(resolve, reject) {
		if(Builds.buildsGet) {
			let apiResult = Builds.buildsGet();
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

