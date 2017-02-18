import { CommandOptions } from '../utils/CommandOptions';
import { AbstractTemplateParser } from './AbstractTemplateParser';
import { Parser } from './Parser';
import { Translations } from '../utils/Translations';

export class RegExpParser extends AbstractTemplateParser implements Parser {
	constructor (private options: CommandOptions) {
		super();
	}
	public extract (contents: string, path?: string): Translations {
		return this._parseTemplate(contents);
	}

	protected _parseTemplate (template: string): Translations {
		let collection: Translations = new Translations();
		this.options.keys.forEach((key) => {
			const regExp: RegExp = new RegExp(key, 'g');
			let matches: RegExpExecArray | null;
			while (matches = regExp.exec(template)) {
				collection = collection.add(matches[1]);
			}
		});
		return collection;
	}

}
