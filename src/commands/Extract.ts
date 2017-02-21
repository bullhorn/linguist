import * as fs from 'fs';
import * as path from 'path';
import { Extractor } from '../utils/extractor';
import { Translations } from '../utils/Translations';
import { Compiler, getCompiler } from '../compilers/Compiler';
import { Parser, getParsers } from '../parsers/Parser';
import { Logger } from '../utils/LumberJack';
import { Utils } from '../utils/Utils';
import { CommandOptions } from '../utils/CommandOptions';

export class Extract {
	run (...args);
	run (lang: string, config: any = {}) {
		// Logger.clear();
		Logger.spin('loading configuration...');
		let options: CommandOptions = Utils.readConfig(config);
		Logger.spin('initializing...');
		const compiler: Compiler = getCompiler(options);
		const parsers: Parser[] = getParsers(options);
		const normalizedOutput: string = path.resolve(options.dest);
		let outputDir: string = normalizedOutput;
		let outputFilename: string = `${options.prefix}${lang}.${compiler.extension}`;
		if (!fs.existsSync(normalizedOutput) || !fs.statSync(normalizedOutput).isDirectory()) {
			outputDir = path.dirname(normalizedOutput);
			outputFilename = path.basename(normalizedOutput);
		}
		const outputPath: string = path.join(outputDir, outputFilename);
		[outputDir].forEach(dir => {
			if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
				Logger.error(`✗ The path you supplied was not found: '${dir}'`);
			}
		});
		try {
			let collection: Translations = new Translations();
			options.sources.forEach((source) => {
				const normalizedDir: string = path.resolve(source);
				if (!fs.existsSync(normalizedDir) || !fs.statSync(normalizedDir).isDirectory()) {
					Logger.error(`✗ The path you supplied was not found: '${normalizedDir}'`);
				}
				const extractor: Extractor = new Extractor(parsers, options.patterns);
				Logger.spin(`Extracting strings from '${normalizedDir}'`);

				const extracted: Translations = extractor.process(normalizedDir);
				Logger.success(`✔︎ Extracted ${extracted.count()} strings`);

				collection.union(extracted);
				if (!options.replace && fs.existsSync(outputPath)) {
					const existing: Translations = compiler.parse(fs.readFileSync(outputPath, 'utf-8'));
					if (existing.count() > 0) {
						collection = extracted.union(existing);
						Logger.success(`✔︎ Merged with ${existing.count()} existing strings`);
					}

					if (options.clean) {
						const collectionCount = collection.count();
						collection = collection.intersect(extracted);
						const removeCount = collectionCount - collection.count();
						if (removeCount > 0) {
							Logger.success(`✔︎ Removed ${removeCount} obsolete strings`);
						}
					}
				}
			});
			collection = collection.sort();
			fs.writeFileSync(outputPath, compiler.compile(collection));
			Logger.success(`✔︎ Saved to '${outputPath}'`);
		} catch (err) {
			Logger.error('✗ An error occurred', err);
		}
	}
}
