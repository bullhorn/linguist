import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';
import { Compiler, getCompiler } from '../compilers/Compiler';
import { Parser, getParsers } from '../parsers/Parser';
import { Utils } from '../utils/Utils';
import { Extractor } from '../utils/Extractor';
import { Translations } from '../utils/Translations';
import { Logger } from '../utils/LumberJack';
import { CommandOptions } from '../utils/CommandOptions';

export class Check {
    run (...args): Promise<any>;
    run (lang: string, config: any): Promise<any> {
        // Logger.clear();
        Logger.spin('loading config...');
        let options: CommandOptions = Utils.readConfig(config);
        Logger.spin('initializing...');
        const compiler: Compiler = getCompiler(options);
		const parsers: Parser[] = getParsers(options);
        const normalizedOutput: string = path.resolve(options.dest);
		let outputDir: string = normalizedOutput;
		let outputFilename: string = `${options.prefix}${lang}.${compiler.extension}`;
		const outputPath: string = path.join(outputDir, outputFilename);
        let controlFilename: string = `${options.prefix}${options.locale}.${compiler.extension}`;
		const controlPath: string = path.join(outputDir, controlFilename);

		[outputDir].forEach(dir => {
			if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
				Logger.error(`✗ The path you supplied was not found: '${dir}'`);
			}
		});
		try {
			let collection: Translations = new Translations();
            Logger.info('sources', options.sources);
			options.sources.forEach((source) => {
				const normalizedDir: string = path.resolve(source);
				if (!fs.existsSync(normalizedDir) || !fs.statSync(normalizedDir).isDirectory()) {
					Logger.error(`✗ The path you supplied was not found: '${normalizedDir}'`);
				}
				const extractor: Extractor = new Extractor(parsers, options.patterns);
				Logger.spin(`Extracting strings from '${normalizedDir}'`);

				const extracted: Translations = extractor.process(normalizedDir);
				Logger.success(`✔︎ Extracted ${extracted.count()} strings from '${normalizedDir}'`);

				collection = collection.union(extracted);
            });
            collection.sort();

            if (!fs.existsSync(controlPath)) {
                Logger.error(`✗ Control file does not exist: '${controlPath}'`);
                Logger.success(`✔︎ ${collection.count()} keys found`);
                if (options.verbose) {
                    collection.forEach((key, value) => {
                        Logger.warn(`✗ ${key}`);
                    });
                }
                return Promise.resolve(collection);
            } else {
                const existing: Translations = compiler.read(controlPath);
                Logger.info(`* Loaded Control file`);
                if (existing.count() > 0) {
                    let missing = collection.minus(existing);
                    let included = collection.intersect(existing);
                    let unused = existing.minus(collection);
                    Logger.success(`✔︎ ${included.count()} existing keys found`);
                    if (missing.count() > 0) {
                        Logger.error(`✗ Missing ${missing.count()} keys`);
                        if (options.verbose) {
                            missing.forEach((key, value) => {
                                Logger.warn(`✗ ${key}`);
                            });
                        }
                    }
                    if (unused.count() > 0) {
                        Logger.error(`✗ Found ${unused.count()} unused keys`);
                        if (options.verbose) {
                            unused.forEach((key, value) => {
                                Logger.warn(`⊘ ${key}`);
                            });
                        }
                    }
                    if (missing.count() <= 0 && unused.count() <= 0) {
                        Logger.success('✔︎ All keys found');
                    }
                    return Promise.resolve(missing);
                }
                return Promise.resolve(existing);
            }
        } catch (err) {
			Logger.error('✗ An error occurred', err);
            return Promise.reject(err);
		}
    }
}
