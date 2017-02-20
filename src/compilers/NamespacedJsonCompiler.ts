import { AbstractCompiler } from './AbstractCompiler';
import { Compiler } from './Compiler';
import { Translations } from '../utils/Translations';
import * as flat from 'flat';

export class NamespacedJsonCompiler extends AbstractCompiler implements Compiler {
	public extension: string = 'json';

	public compile (collection: Translations): string {
		const values = flat.unflatten(collection.values, { object: true });
		return JSON.stringify(values, null, '\t');
	}

	public parse (contents: string): Translations {
		const values = flat.flatten(JSON.parse(contents));
		return new Translations(values);
	}
}
