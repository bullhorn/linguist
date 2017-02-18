import { AbstractCompiler } from './AbstractCompiler';
import { Compiler } from './Compiler';
import { Translations } from '../utils/Translations';

export class JsonCompiler extends AbstractCompiler implements Compiler {
	public extension: string = 'json';

	public compile (collection: Translations): string {
		return JSON.stringify(collection.values, null, '\t');
	}

	public parse (contents: string): Translations {
		return new Translations(JSON.parse(contents));
	}

}
