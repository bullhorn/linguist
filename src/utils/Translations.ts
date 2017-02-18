export interface TranslationType {
	[key: string]: string;
};

export class Translations {
	public language: string = 'en-US';
	public values: TranslationType = {};

	public constructor (values: TranslationType = {}) {
		this.values = values;
	}

	public add (key: string, val: string = ''): Translations {
		return new Translations(Object.assign({}, this.values, { [key]: val }));
	}

	public addKeys (keys: string[]): Translations {
		const values = keys.reduce((results, key) => {
			results[key] = '';
			return results;
		}, {} as TranslationType);
		return new Translations(Object.assign({}, this.values, values));
	}

	public remove (key: string): Translations {
		return this.filter(k => key !== k);
	}

	public forEach (callback: (key: string, val?: string) => void): Translations {
		Object.keys(this.values).forEach(key => callback.call(this, key, this.values[key]));
		return this;
	}

	public filter (callback: (key: string, val?: string) => boolean): Translations {
		let values: TranslationType = {};
		this.forEach((key: string, val: string) => {
			if (callback.call(this, key, val)) {
				values[key] = val;
			}
		});
		return new Translations(values);
	}

	public union (collection: Translations): Translations {
		return new Translations(Object.assign({}, this.values, collection.values));
	}

	public intersect (collection: Translations): Translations {
		let values: TranslationType = {};
		this.filter(key => collection.has(key))
			.forEach((key: string, val: string) => {
				values[key] = val;
			});

		return new Translations(values);
	}

	public minus (collection: Translations): Translations {
		let values: TranslationType = {};
		this.filter(key => !collection.has(key))
			.forEach((key: string, val: string) => {
				values[key] = val;
			});
		return new Translations(values);
	}

	public has (key: string): boolean {
		let sanitized: string = key.replace(/(\.other\.[\d]+|\.[\d]+|\.many|\.zero|\.few|\.male|\.female)/g, '');
		return this.values.hasOwnProperty(sanitized);
	}

	public get (key: string): string {
		return this.values[key];
	}

	public keys (): string[] {
		return Object.keys(this.values);
	}

	public count (): number {
		return Object.keys(this.values).length;
	}

	public isEmpty (): boolean {
		return Object.keys(this.values).length === 0;
	}

	public sort (compareFn?: (a: string, b: string) => number): Translations {
		if (!compareFn) {
			// if no compare functions is provided use a case insensitive sorting function
			compareFn = (a, b) => a.toLowerCase().localeCompare(b.toLowerCase());
		}

		let collection = new Translations();
		let sortedKeys = this.keys().sort(compareFn);
		sortedKeys.forEach((key) => {
			collection = collection.add(key, this.get(key));
		});
		return collection;
	}
}
