
import { ResponseObject } from '../utils/ResponseObject';

export function pingGET() : ResponseObject {
	const array = [
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
	const array = [
		"/ping"
	];

	return new ResponseObject(array);
}