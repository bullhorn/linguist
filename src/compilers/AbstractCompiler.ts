import * as fs from 'fs';
import * as path from 'path';
import { Compiler, getCompiler } from './Compiler';
import { CommandOptions } from '../utils/CommandOptions';
import { Translations } from '../utils/Translations';
import { Logger } from '../utils/LumberJack';

export abstract class AbstractCompiler {
    constructor (private options: CommandOptions) { }

    public getSourceTranslations (): Translations {
        const compiler: Compiler = getCompiler(this.options);
        const normalizedOutput: string = path.resolve(this.options.dest);
        let outputDir: string = normalizedOutput;
        let controlFilename: string = `${this.options.prefix}${this.options.locale}.${compiler.extension}`;
        const controlPath: string = path.join(outputDir, controlFilename);

        if (!fs.existsSync(controlPath)) {
            Logger.error(`✗ Source translations not found, will use target translations as source.`);
            return new Translations();
        }

        return compiler.parse(fs.readFileSync(controlPath, 'utf-8'));
    }

    public read (path): Translations {
        if (!fs.existsSync(path)) {
            Logger.error(`✗ Output translations not found, will translate all keys.`);
            return new Translations();
        }
        return this.parse(fs.readFileSync(path, 'utf-8'));
    }

    parse (contents: string): Translations {
        return new Translations();
    }

}