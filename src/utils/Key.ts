
import { v4 as uuidv4 } from 'uuid';
import { Comparator } from 'typescriptcollectionsframework';

export class Key {
	private key : string;
	private expiry : Date;

	public static get KEY_COMPARATOR() : Comparator<Key> {
		const comparator : Comparator<Key> = {
			compare(o1 : Key, o2 : Key) : number {
				if(o1.key === o2.key) {
					return 0;
				} else {
					return (o1.key < o2.key) ? 1 : -1;
				}
			}
		};
		return comparator;
	}

	public constructor() {
		this.key = uuidv4();
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		this.expiry = tomorrow;
	}

	public getKey() : string {
		return this.key;
	}

	public getExpiry() : Date {
		return this.expiry;
	}

	/**
	 * Returns a Key object for the given key, which can then be compared against other Key objects (minus the expiry).
	 * @param key
	 */
	public static KeyFrom(key : string) : Key {
		const k : Key = new Key();
		k.key = key;
		return k;
	}

}