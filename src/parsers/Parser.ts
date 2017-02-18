import { CommandOptions } from '../utils/CommandOptions';
import { Translations } from '../utils/Translations';
import { Logger } from '../utils/LumberJack';
import { PipeParser } from './PipeParser';
import { DirectiveParser } from './DirectiveParser';
import { ServiceParser } from './ServiceParser';
import { RegExpParser } from './RegExpParser';
import { AstServiceParser } from './AstServiceParser';

export interface Parser {
	extract (contents: string, path?: string): Translations;
}

export function getParsers (options: CommandOptions): Array<Parser> {
	const parsers: Parser[] = [
		new PipeParser(),
		new DirectiveParser(),
		new ServiceParser()
	];
	if (options.keys && options.keys.length) {
		Logger.info(`+ Custom keys found, adding regular expression parser`);
		parsers.push(new RegExpParser(options));
	}

	return parsers;
}
