import { ResponseObject } from "../utils/ResponseObject";
const { BlobServiceClient } = require("@azure/storage-blob");

const connStr: string | undefined = process.env.AzureBlobStoreConnectionString;
let blobServiceClient: any;
if (typeof (connStr) !== 'undefined') {
	blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
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
		const containerClient = blobServiceClient.getContainerClient(artifact);
		const blobsA = containerClient.listBlobsFlat();
		const blobs = [];
		for await (const blob of blobsA) {
			const buildId = blob.name.match("(.*)/.*?")[1];
			blobs.push({
				artifact,
				buildId,
				name: blob.name,
				date: blob.properties.createdOn,
				link: '/builds/' + artifact + "/" + encodeURIComponent(blob.name),
				fullLink: 'https://apps.methodscript.com/builds/' + artifact + '/' + encodeURIComponent(blob.name)
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