import { ResponseObject } from "../utils/ResponseObject";
import {ExecException} from "child_process";
const { BlobServiceClient } = require("@azure/storage-blob");
const { TableClient } = require("@azure/data-tables");
const util = require('util');
const exec = util.promisify(require("child_process").exec);

const connStr: string | undefined = process.env.AzureBlobStoreConnectionString;
let blobServiceClient: any;
let tableClient: any;

const buildInfoCache: any = {};

if (typeof (connStr) !== 'undefined') {
	blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
	tableClient = TableClient.fromConnectionString(connStr, "BuildInfo");
}

export async function buildsGET(): Promise<ResponseObject> {
	const containersA = blobServiceClient.listContainers();
	const containers = [];
	for await (const container of containersA) {
		containers.push(container.name);
	}
	return Promise.resolve(new ResponseObject(containers));
}

export async function buildsArtifactGET(artifact: string): Promise<ResponseObject> {
	try {
		// Pull the repo
		exec("cd ~/repo; git pull");
		const containerClient = blobServiceClient.getContainerClient(artifact);
		const blobsA = containerClient.listBlobsFlat();
		const blobs = [];
		for await (const blob of blobsA) {
			const buildId = blob.name.match("(.*)/.*?")[1];
			let sha = "";
			let commitDetails = "";
			if(artifact == "commandhelperjar") {
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
			blobs.push({
				artifact,
				buildId,
				name: blob.name,
				date: blob.properties.createdOn,
				link: '/builds/' + artifact + "/" + encodeURIComponent(blob.name),
				fullLink: 'https://apps.methodscript.com/builds/' + artifact + '/' + encodeURIComponent(blob.name),
				sha,
				commitDetails
			});
		}
		return Promise.resolve(new ResponseObject(blobs));
	} catch (ex) {
		return Promise.resolve(new ResponseObject(ex.message, 400));
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

export async function buildsArtifactIdGET(artifact: string, id: string): Promise<ResponseObject> {
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
	} catch (ex) {
		return Promise.resolve(new ResponseObject(ex.message, 400));
	}
}
