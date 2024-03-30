import { ResponseObject } from "../utils/ResponseObject";
import * as Models from "../../models/Api";
const { BlobServiceClient } = require("@azure/storage-blob");
const { TableClient } = require("@azure/data-tables");
const util = require('util');
const exec = util.promisify(require("child_process").exec);

const connStr: string | undefined = process.env.AzureBlobStoreConnectionString;
const runningLocal: boolean = ("true" === process.env.RunningLocal) || false;
let blobServiceClient: any;
let tableClient: any;

const buildInfoCache: any = {};
const buildMetaCache: any = {};

if (typeof (connStr) !== 'undefined' && connStr !== null && connStr !== "") {
	blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
	tableClient = TableClient.fromConnectionString(connStr, "BuildInfo");
}
setInterval(function() {
	// Pull the repo
	if(!runningLocal) {
		console.log("Updating repo.");
		var errorHandler = (error: Error, stdout: string, stderr: string) => {
			if(error) {
				console.log(stderr);
			}
		};
		exec("cd ~/repo; git fetch origin;", errorHandler);
		setTimeout(function() {
			exec("git reset --hard origin/master", errorHandler);
			console.log("Repo update complete.");
		}, 1000);
	}
}, 60000);

export async function buildsGet(): Promise<ResponseObject> {
	const containersA = blobServiceClient.listContainers();
	const containers = [];
	for await (const container of containersA) {
		containers.push(container.name);
	}
	return Promise.resolve(new ResponseObject(containers));
}

export async function buildsArtifactGet(latest: boolean, artifact: string): Promise<ResponseObject> {
	// TODO: Figure out why the framework reverses these parameters.
	try {
		if(typeof(blobServiceClient) === "undefined") {
			return Promise.resolve(new ResponseObject("AzureBlobStoreConnectionString must be set to run this command.", 400));
		}
		const containerClient = blobServiceClient.getContainerClient(artifact);
		const blobsA = containerClient.listBlobsFlat();
		const blobs : Array<Models.BuildArtifact> = [];
		let latestArtifact : Models.BuildArtifact | null = null;
		const oneWeekAgo = new Date();
		oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
		for await (const blob of blobsA) {
			const buildId = blob.name.match("(.*)/.*?")[1];
			let meta;
			if(buildId in buildMetaCache
					// Always grab more recent builds, in case it's been changed just now.
					&& new Date(blob.properties.createdOn) < oneWeekAgo) {
				meta = buildMetaCache[buildId];
			} else {
				const blockBlobClient = containerClient.getBlockBlobClient(blob.name);
				meta = (await blockBlobClient.getProperties()).metadata;
				buildMetaCache[buildId] = meta;
			}
			let sha = "";
			let commitDetails = "";
			let poisoned: boolean = false;
			if(artifact === "commandhelperjar" && !runningLocal) {
				// Other builds don't currently have this info
				if(!(buildId in buildInfoCache)) {
					const buildNumber = buildId.match("build-(.*)")[1];
					if(buildNumber > 84) {
						// Builds less than 84 didn't have info yet, just skip these.
						console.log("Looking up build info for " + buildId);
						try {
							sha = (await tableClient.getEntity(artifact, buildId)).SHA;
						} catch(e) {
							// Not all builds have meta info
							console.log(e);
						}
						if(sha && sha.match(/[a-z0-9]{40}/)) {
							const { stdout, stderr } = await exec("cd ~/repo; git log -1 " + sha);
							commitDetails = stdout;
						}
					}
					buildInfoCache[buildId] = {sha, commitDetails};
				}
				sha = buildInfoCache[buildId].sha;
				commitDetails = buildInfoCache[buildId].commitDetails;
			}
			// To set a build as poisoned, set the file itself to have the metadata "poisoned"->"true"
			if(typeof(meta.poisoned) !== "undefined") {
				poisoned = meta.poisoned === "true";
			}
			const buildArtifact : Models.BuildArtifact = {
				artifact,
				buildId,
				name: blob.name,
				date: blob.properties.createdOn,
				link: '/builds/' + artifact + "/" + encodeURIComponent(blob.name),
				fullLink: 'https://apps.methodscript.com/builds/' + artifact + '/' + encodeURIComponent(blob.name),
				sha,
				commitDetails,
				poisoned
			};
			if(latest) {
				if(latestArtifact == null) {
					latestArtifact = buildArtifact;
				} else if(!poisoned) {
					const currentDate : Date = new Date(buildArtifact.date);
					const latestDate : Date = new Date(latestArtifact.date);
					if(currentDate > latestDate) {
						latestArtifact = buildArtifact;
					}
				}
			} else {
				blobs.push(buildArtifact);
			}
		}
		if(latest && latestArtifact != null) {
			blobs.push(latestArtifact);
		}
		return Promise.resolve(new ResponseObject(blobs));
	} catch (ex: unknown) {
		if(ex instanceof Error) {
			return Promise.resolve(new ResponseObject(ex.message, 400));
		}  else {
			return Promise.resolve(new ResponseObject(ex, 400));
		}
	}
}

async function streamToBuffer(readableStream : any) {
	return new Promise((resolve, reject) => {
		const chunks : any = [];
		readableStream.on("data", (data : any) => {
			chunks.push(data instanceof Buffer ? data : Buffer.from(data));
		});
		readableStream.on("end", () => {
			resolve(Buffer.concat(chunks));
		});
		readableStream.on("error", reject);
	});
}

export async function buildsArtifactIdGet(artifact: string, id: string): Promise<ResponseObject> {
	if (id === null) {
		return Promise.resolve(new ResponseObject("Invalid id", 400));
	}
	const match = id.match("(.*)/(.*)\\.(.*?)$");
	if (match === null) {
		return Promise.resolve(new ResponseObject("Invalid id", 400));
	}
	const filename = match[2] + "-" + match[1] + "." + match[3];
	try {
		const containerClient = blobServiceClient.getContainerClient(artifact);
		const blobClient = containerClient.getBlobClient(id);
		const downloadBlockBlobResponse = await blobClient.download();
		const buffer = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);
		const ro = new ResponseObject(buffer, 200, "application/java-archive");
		ro.addHeader("Content-Disposition", "attachment; filename=" + filename);
		return Promise.resolve(ro);
	} catch (ex: unknown) {
		if(ex instanceof Error) {
			return Promise.resolve(new ResponseObject(ex.message, 400));
		} else {
			return Promise.resolve(new ResponseObject(ex, 400));
		}
	}
}
