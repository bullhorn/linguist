import { AbstractTemplateParser } from './AbstractTemplateParser';
import { Parser } from './Parser';
import { Translations } from '../utils/Translations';

export class PipeParser extends AbstractTemplateParser implements Parser {

	public extract (contents: string, path?: string): Translations {
		if (path && this._isAngularComponent(path)) {
			contents = this._extractInlineTemplate(contents);
		}

		return this._parseTemplate(contents);
	}

	protected _parseTemplate (template: string): Translations {
		let collection: Translations = new Translations();
		const regExp: RegExp = /(['"`])([^>\1\r\n'"`]*?)\1\s*\|\s*translate/g;
		// const regExp: RegExp = /{{\\s?[']([^']+)['][^|]*\\|\\s?translate[^}]*}}/g;
		let matches: RegExpExecArray | null;
		while (matches = regExp.exec(template)) { // tslint:disable-line
			collection = collection.add(matches[2]);
		}
		return collection;
	}
}
