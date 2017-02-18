import { AbstractCompiler } from './AbstractCompiler';
import { Compiler } from './Compiler';
import { Translations, TranslationType } from '../utils/Translations';

import * as gettext from 'gettext-parser';

export class PoCompiler extends AbstractCompiler implements Compiler {

	/**
	 * Translation domain
	 */
	public domain = '';
	public extension: string = 'pot';
	
	public compile(collection: Translations): string {
		const data = {
			charset: 'utf-8',
			headers: {
				'mime-version': '1.0',
				'content-type': 'text/plain; charset=utf-8',
				'content-transfer-encoding': '8bit'
			},
			translations: {
				[this.domain]: Object.keys(collection.values).reduce((translations, key) => {
					translations[key] = {
						msgid: key,
						msgstr: collection.get(key)
					};
					return translations;
				}, <any> {})
			}
		};

		return gettext.po.compile(data, 'utf-8');
	}

	public parse(contents: string): Translations {
		const collection = new Translations();

		const po = gettext.po.parse(contents, 'utf-8');
		if (!po.translations.hasOwnProperty(this.domain)) {
			return collection;
		}

		const values = Object.keys(po.translations[this.domain])
			.filter(key => key.length > 0)
			.reduce((values, key) => {
				values[key] = po.translations[this.domain][key].msgstr.pop();
				return values;
			}, <TranslationType> {});

		return new Translations(values);
	}

}
