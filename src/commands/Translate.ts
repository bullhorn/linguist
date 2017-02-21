import * as fs from 'fs';
import * as path from 'path';
import { Compiler, getCompiler } from '../compilers/Compiler';
import { Translations } from '../utils/Translations';

import fetch from 'node-fetch';
import { Lazy, LazyPromise, Utils } from '../utils/Utils';
import { Logger } from '../utils/LumberJack';
import { CommandOptions } from '../utils/CommandOptions';

export class Translate {
    run (...args): Promise<any>;
    run (lang: string, config: any = {}): Promise<any> {
        Logger.spin('loading config...');
        let options: CommandOptions = Utils.readConfig(config);
        Logger.spin('initializing...');
        const compiler: Compiler = getCompiler(options);
        const normalizedOutput: string = path.resolve(options.dest);
		let outputDir: string = normalizedOutput;
		let outputFilename: string = `${options.prefix}${lang}.${compiler.extension}`;
		const outputPath: string = path.join(outputDir, outputFilename);
        [outputDir].forEach(dir => {
			if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
				Logger.error(`✗ The path you supplied was not found: '${dir}'`);
			}
		});
		try {
			const collection: Translations = compiler.getSourceTranslations();
            let existing: Translations = compiler.read(outputPath);
            Logger.info(`* Loaded Control file`);
            if (collection.count() > 0) {
                let missing = collection.minus(existing);
                Logger.success(`✔︎ ${collection.count()} existing keys found`);
                if (missing.count() > 0) {
                    Logger.error(`✗ Missing ${missing.count()} translations`);
                    let promises: Array<LazyPromise<any>> = [];
                    // let translations: Translations = new Translations();
                    missing.forEach((key, value) => {
                        promises.push(
                            Lazy((resolve, reject) => {
                                this.translate(collection.get(key), options.locale.slice(0, 2), lang.slice(0, 2))
                                    .then(translated => {
                                        Logger.spin(`translating...${missing.keys().indexOf(key)} of ${missing.count()}`);
                                        existing = existing.add(key, translated);
                                    })
                                    .then(resolve)
                                    .catch(reject);
                            })
                        );
                    });
                    Logger.spin('translating...');
                    return Utils.series(promises, 1)
                        .then(() => {
                            existing = existing.sort();
                            fs.writeFileSync(outputPath, compiler.compile(existing));
			                Logger.success(`✔︎ Saved to '${outputPath}'`);
                            return existing;
                        })
                        .catch((err) => {
                            Logger.error('✗ An error occurred', err);
                        });
                } else {
                    Logger.success('✔︎ All translations found');
                    return Promise.resolve(collection);
                }
            } else {
                return Promise.resolve(collection);
            }
        } catch (err) {
			Logger.error('✗ An error occurred', err);
            return Promise.reject(err);
		}
    }

    translate (phrase: string, source: string = 'en', target: string = 'de'): Promise<string> {
        let uri = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURI(phrase)}`;
        return fetch(uri)
            .then(response => {
                return response.text();
            })
            .then(result => {
                try {
                    let data = JSON.parse(String(result).replace(/(,+)/gi, ','));
                    return data[0][0][0];
                } catch (err) {
                    return 'No translation found';
                }
            });
    }

}
