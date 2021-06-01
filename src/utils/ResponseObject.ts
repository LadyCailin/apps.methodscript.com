
export class ResponseObject {

	/**
	 * A ResponseObject with the status code 200, and the payload "OK".
	 */
	public static get OK() : ResponseObject { return new ResponseObject("OK", 200, "text/plain"); }

	/**
	 * A ResponseObject with the status code 501, and the payload "Not Implemented Yet";
	 */
	public static get NOT_IMPLEMENTED() : ResponseObject { return new ResponseObject("Not Implemented Yet", 501, "text/plain"); }

	public static get FORBIDDEN() : ResponseObject { return new ResponseObject("Forbidden", 403, "text/plain"); }

	private payload : any;
	private code : number;
	private contentType : string;
	private headers : any = {};

	public constructor(payload : any, code : number = 200, contentType : string | null = null) {
		this.payload = payload;
		this.code = code;
		if(contentType == null) {
			contentType = typeof payload === "object" ? "application/json" : "text/plain";
		}
		this.contentType = contentType;
	}

	public getPayload() : any {
		return this.payload;
	}

	public getCode() : number {
		return this.code;
	}

	public getContentType() : string {
		return this.contentType;
	}

	public addHeader(name : string, value : string) : void {
		this.headers[name] = value;
	}

	public getHeaders() : Map<string, string> {
		return this.headers;
	}
}