import { AbstractTemplateParser } from './AbstractTemplateParser';
import { Parser } from './Parser';
import { Translations } from '../utils/Translations';

import * as $ from 'cheerio';

export class DirectiveParser extends AbstractTemplateParser implements Parser {
	public extract (contents: string, path?: string): Translations {
		if (path && this._isAngularComponent(path)) {
			contents = this._extractInlineTemplate(contents);
		}

		return this._parseTemplate(contents);
	}

	protected _parseTemplate (template: string): Translations {
		let collection: Translations = new Translations();

		template = this._normalizeTemplateAttributes(template);

		const selector = '[translate], [ng2-translate]';
		$(template)
			.find(selector)
			.addBack(selector)
			.each((i: number, element: CheerioElement) => {
				const $element = $(element);
				const attr = $element.attr('translate') || $element.attr('ng2-translate');

				// The key is never the attribute value
				// if (attr) {
				// 	collection = collection.add(attr);
				// } else {
					$element
						.contents()
						.toArray()
						.filter(node => node.type === 'text')
						.map(node => node.nodeValue.trim())
						.filter(text => text.length > 0)
						.forEach(text => collection = collection.add(text));
				// }
			});

		return collection;
	}

	/**
	 * Angular's `[attr]="'val'"` syntax is not valid HTML,
	 * so it can't be parsed by standard HTML parsers.
	 * This method replaces `[attr]="'val'""` with `attr="val"`
	 */
	protected _normalizeTemplateAttributes (template: string): string {
		return template.replace(/\[([^\]]+)\]="'([^']*)'"/g, '$1="$2"');
	}
}
