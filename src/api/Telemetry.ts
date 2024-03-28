import { ResponseObject } from "../utils/ResponseObject";
import { KeyManager } from "../utils/KeyManager";
import { Key } from "../utils/Key";
import * as https from "https";

const keyManager : KeyManager = new KeyManager();
const replacementKey : string = "28cb72ef-45fe-4634-b7e3-ea672db27cf0";
const replacementDashless : string = replacementKey.replace(/-/g, '');
const realKey : string | undefined = process.env.ApplicationInsightsInstrumentationKey;
const realKeyDashless : string | undefined = realKey ? realKey.replace(/-/g, '') : realKey;
const azureAppInsightsHostname : string = "dc.services.visualstudio.com";
const azureAppInsightsPath : string = "/v2/track";
let nag : boolean = true;

const supportedMetrics : Array<string> = [
	"metrics.methodscript.startup",
	"logs.methodscript.startupMode",
	"metrics.methodscript.saOn",
];
/**
 * Returns true if the metric is supported.
 */
function validateMetric(metric : string) : boolean {
	return supportedMetrics.indexOf(metric) >= 0;
}

export function telemetryGet() : ResponseObject {
	const key : Key = keyManager.generateKey();
	const response : ResponseObject = new ResponseObject(key.getKey(), 200, "text/plain");
	return response;
}

export function telemetryKeyPost(body : string, key : string) : ResponseObject {
	if(!keyManager.validKey(key)) {
		return ResponseObject.FORBIDDEN;
	}
	
	if(typeof realKey === "undefined") {
		if(nag) {
			console.log("Returning fake OK from now on, but Application Insights key is not configured correctly."
				+ " Please configure the environment to have the value \"ApplicationInsightsInstrumentationKey\".");
			nag = false;
		}
		return ResponseObject.OK;
	}

	// Do some basic validation on the object.
	const obj : any = JSON.parse(body);
	let valid : boolean = true;
	let malicious : boolean = false;

	if(valid && typeof obj.iKey === "undefined") {
		valid = false;
	}

	if(valid && obj.iKey !== replacementKey) {
		// Clearly malicious.
		valid = false;
		malicious = true;
	}

	if(valid && !(obj.data && obj.data.baseData && obj.data.baseData.name && validateMetric(obj.data.baseData.name))) {
		valid = false;
	}

	if(malicious) {
		// Just return OK. We don't want to let them know they didn't succeed.
		return ResponseObject.OK;
	}

	// Replace the placeholder with the real key
	obj.iKey = realKey;
	obj.name = obj.name.replace(replacementDashless, realKeyDashless);

	// TODO: Submit telemetry event to ApplicationInsights

	const data = JSON.stringify(obj);

	console.log("Submitting " + data);

	const options = {
		hostname: azureAppInsightsHostname,
		port: 443,
		path: azureAppInsightsPath,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': data.length
		}
	}

	const req = https.request(options, (res) => {
		console.log(`statusCode: ${res.statusCode}`)
		res.on('data', (d) => {
			// Just ignore successes.
			if(res.statusCode !== 200) {
				process.stdout.write(d);
			}
		})
	})

	req.on('error', (error) => {
		console.error(error)
	})

	req.write(data)
	req.end()

	return ResponseObject.OK;
}