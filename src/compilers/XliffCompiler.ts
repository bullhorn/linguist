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

export class XliffCompiler extends AbstractCompiler implements Compiler {
    public source: Translations;
    public extension: string = 'xlf';

    public compile (target: Translations): string {
        let pkg = Utils.readJSON('./package.json');
        let source: Translations = this.getSourceTranslations();
        if ( source.count() <= 0 ) {
            source = target;
            target = new Translations();
        }
        const xmlJs = {
            $: {
                xmlns: 'urn:oasis:names:tc:xliff:document:1.2',
                version: '1.2'
            }
        };
        // <file source-language="{{from}}" target-language="{{to}}" datatype="plaintext" original="messages" date="{{timestamp}}" product-name="{{name}}">
        let file = {
            $: {
                'source-language': source.language,
                'target-language': target.language,
                datatype: 'plaintext',
                original: 'messages',
                // date: Date.now(),
                'product-name': (pkg.name || 'app')
            }
        };
        let units: Array<any> = Object.keys(source.values).reduce((translations: Array<any>, key: string) => {
            translations.push({
                $: { id: key, datatype: 'html' },
                source: source.get(key),
                target: target.get(key)
            });
            return translations;
        }, []);
        let body = { 'trans-unit': units };
        file['body'] = [body];
        xmlJs['file'] = [file];
        return builder.buildObject(xmlJs);
    }

    public parse (contents: string): Translations {
        const result = {
            values: {}
        };
        try {
            parser.parseString(contents, (err, data) => {
                if (err) {
                    throw err;
                }
                result.values = data.xliff.file.body['trans-unit']
                    .reduce((values, unit) => {
                        values[unit.$.id] = unit.target[0];
                        return values;
                    }, {});
            });
        } catch (err) {
            // do nothing
        }

        return new Translations(result.values);
    }

}
