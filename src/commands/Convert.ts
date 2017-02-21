import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';
import { Compiler, getCompiler } from '../compilers/Compiler';
import { Parser, getParsers } from '../parsers/Parser';
import { Utils } from '../utils/Utils';
import { Translations } from '../utils/Translations';
import { Logger } from '../utils/LumberJack';
import { CommandOptions } from '../utils/CommandOptions';

export class Convert {
    run (...args): Promise<any>;
    run (lang: string, to: string, config: any): Promise<any> {
        // Logger.clear();
        Logger.spin('loading config...');
        let options: CommandOptions = Utils.readConfig(config);
        Logger.spin('initializing...');
        const reader: Compiler = getCompiler(options);
        let newOpts = Object.assign({}, options, {format: to});
        const writer: Compiler = getCompiler(newOpts);
        const normalizedOutput: string = path.resolve(options.dest);
		let outputDir: string = normalizedOutput;
		let outputFilename: string = `${options.prefix}${lang}.${writer.extension}`;
		const outputPath: string = path.join(outputDir, outputFilename);
        let controlFilename: string = `${options.prefix}${lang}.${reader.extension}`;
		const controlPath: string = path.join(outputDir, controlFilename);

		[outputDir].forEach(dir => {
			if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
				Logger.error(`✗ The path you supplied was not found: '${dir}'`);
			}
		});
		try {
			const collection: Translations = reader.parse(fs.readFileSync(controlPath, 'utf-8'));
            Logger.info(`* Loaded Control file`);
			fs.writeFileSync(outputPath, writer.compile(collection));
			Logger.success(`✔︎ Saved to '${outputPath}'`);
			return Promise.resolve(collection);
        } catch (err) {
			Logger.error('✗ An error occurred', err);
			return Promise.reject(err);
		}
    }
}
