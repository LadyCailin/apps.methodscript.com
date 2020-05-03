import { Key } from "./Key";
import { JSet, TreeSet } from "typescriptcollectionsframework";

export class KeyManager {

	private keys : JSet<Key> = new TreeSet(Key.KEY_COMPARATOR);

	public constructor() {}

	private cull() : void {
		const now : Date = new Date();
		const that = this;
		this.keys.forEach({
			accept(myKey : Key) {
				if(myKey.getExpiry() < now) {
					that.keys.remove(myKey);
				}
			}
		});
	}

	public generateKey() : Key {
		const key : Key = new Key();
		this.keys.add(key);
		this.cull();
		return key;
	}

	public validKey(key : string) : boolean {
		this.cull();
		return this.keys.contains(Key.KeyFrom(key));
	}
}