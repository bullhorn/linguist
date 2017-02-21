import { AbstractTemplateParser } from './AbstractTemplateParser';
import { Parser } from './Parser';
import { Translations } from '../utils/Translations';

export class ServiceParser extends AbstractTemplateParser implements Parser {

	public extract (contents: string, path?: string): Translations {
		let collection: Translations = new Translations();

		// const translateServiceVar = this._extractTranslateServiceVar(contents);
		// if (!translateServiceVar) {
		// 	return collection;
		// }

		// const methodRegExp: RegExp = /(?:translate)\s*\(\s*(\[?\s*(['"`])([^\1\r\n]*)\2\s*\]?)/;
		// const regExp: RegExp = new RegExp(`\\.${translateServiceVar}\\.${methodRegExp.source}`, 'g');
		const regExp: RegExp = /\.(?:translate|localize)\s*\(\s*(\[?\s*(['"`])([^\1\r\n]*)\2\s*\]?)/g;
		let matches: RegExpExecArray | null;
		while (matches = regExp.exec(contents)) { // tslint:disable-line
			if (this._stringContainsArray(matches[1])) {
				collection = collection.addKeys(this._stringToArray(matches[1]));
			} else {
				collection = collection.add(matches[3]);
			}
		}

		return collection;
	}

	/**
	 * Extracts name of TranslateService variable for use in patterns
	 */
	protected _extractTranslateServiceVar (contents: string): string {
		const matches = contents.match(/([a-z0-9_]+)\s*:\s*TranslateService/i);
		if (matches === null) {
			return '';
		}

		return matches[1];
	}

	/**
	 * Checks if string contains an array
	 */
	protected _stringContainsArray (input: string): boolean {
		return input.startsWith('[') && input.endsWith(']');
	}

	/**
	 * Converts string to array
	 */
	protected _stringToArray (input: string): string[] {
		if (this._stringContainsArray(input)) {
			return eval(input); // tslint:disable-line
		}

		return [];
	}

}
