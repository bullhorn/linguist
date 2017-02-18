import * as xml2js from 'xml2js';
import { AbstractCompiler } from './AbstractCompiler';
import { Compiler } from './Compiler';
import { Translations, TranslationType } from '../utils/Translations';
import { Utils } from '../utils/Utils';
const parser = new xml2js.Parser();
const builder = new xml2js.Builder({
    rootName: 'xliff',
    headless: true,
    renderOpts: {
        pretty: true,
        indent: ' ',
        newline: '\n'
    }
});

export class Xliff2Compiler extends AbstractCompiler implements Compiler {
    public extension: string = 'xliff';

    public compile(target: Translations): string {
        let pkg = Utils.readJSON('./package.json');
        let source: Translations = this.getSourceTranslations();
        if ( source.count() <= 0 ) {
            source = target;
            target = new Translations();
        }
        const xmlJs = {
            $: {
                xmlns: 'urn:oasis:names:tc:xliff:document:2.0',
                version: '2.0',
                srcLang: source.language,
                trgLang: target.language
            }
        };

        const file: any = {
            $: { id: pkg.name }
        };

        let units: Array<any> = source.keys().reduce((translations: Array<any>, key: string) => {
            translations.push({
                $: { id: key },
                segment: {
                    source: source.get(key),
                    target: target.get(key)
                }
            });
            return translations;
        }, []);

        file['unit'] = units;
        xmlJs['file'] = [file];
        return builder.buildObject(xmlJs);
	}

	public parse(contents: string): Translations {
        const result: Translations = new Translations();

        parser.parseString(contents, (err, data) => {
            const srcLang = data.xliff.$.srcLang;
            const trgLang = data.xliff.$.trgLang;
            result.language = trgLang;
            data.xliff.file.forEach((file) => {
                file.unit.forEach((unit) => {
                    unit.segement.forEach((segment) => {
                        result.add(unit.$.id, segment.target);
                    });
                });
            });
        });

		return result;
	}

}
