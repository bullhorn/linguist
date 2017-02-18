import { Parser } from '../parsers/Parser';
import { Translations } from './Translations';

import * as glob from 'glob';
import * as fs from 'fs';

export class Extractor {

	public constructor (public parsers: Parser[], public patterns: string[]) { }

	/**
	 * Extract strings from dir
	 */
	public process (dir: string): Translations {
		let collection: Translations = new Translations();

		this._readDir(dir, this.patterns).forEach(path => {
			const contents: string = fs.readFileSync(path, 'utf-8');
			this.parsers.forEach((parser: Parser) => {
				collection = collection.union(parser.extract(contents, path));
			});
		});

		return collection;
	}

	/**
	 * Get all files in dir matching patterns
	 */
	protected _readDir (dir: string, patterns: string[]): string[] {
		return patterns.reduce((results, pattern) => {
			return glob.sync(dir + pattern)
				.filter(path => fs.statSync(path).isFile())
				.concat(results);
		}, []);
	}

}
