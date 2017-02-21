import { CommandOptions } from '../utils/CommandOptions';
import { Translations } from '../utils/Translations';
import { JsonCompiler } from './JsonCompiler';
import { XliffCompiler } from './XliffCompiler';
import { Xliff2Compiler } from './Xliff2Compiler';
import { NamespacedJsonCompiler } from './NamespacedJsonCompiler';
import { PoCompiler } from './PoCompiler';

export interface Compiler {
	extension: string;
	compile (collection: Translations): string;
	parse (contents: string): Translations;
	read (outputPath: string): Translations;
	getSourceTranslations (): Translations;
}

export function getCompiler (options: CommandOptions): Compiler {
	let compiler: Compiler;
	let ext: string = 'json';
	switch (options.format) {
		case 'pot':
			compiler = new PoCompiler(options);
			break;
		case 'xliff':
			compiler = new XliffCompiler(options);
			break;
		case 'xliff2':
			compiler = new Xliff2Compiler(options);
			break;
		case 'namespaced-json':
			compiler = new NamespacedJsonCompiler(options);
			break;
		default:
			compiler = new JsonCompiler(options);
			break;
	}

	return compiler;
}
