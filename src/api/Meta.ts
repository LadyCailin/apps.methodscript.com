
import { ResponseObject } from '../utils/ResponseObject';

export function pingGET() : ResponseObject {
	var array = [
		"Pong!",
		"Pang!",
		"Pyong!",
		"Pyoing!",
		"Peng!",
		"Pung!",
		"Pyng!",
		"Polo!"
	];

	return new ResponseObject(array[Math.floor(Math.random() * array.length)]);
}

export function rootGET() : ResponseObject {
	var array = [
		"/ping"
	];

	return new ResponseObject(array);
}