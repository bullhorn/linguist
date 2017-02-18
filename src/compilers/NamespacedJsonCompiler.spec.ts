import test from 'ava';
import { NamespacedJsonCompiler } from './NamespacedJsonCompiler';
import { Translations } from '../utils/Translations';

let compiler: NamespacedJsonCompiler;
test.beforeEach( t => {
    compiler = new NamespacedJsonCompiler({
        locale: 'en',
        sources: ['../test/tmp'],
        patterns: ['/**/*.html'],
        format: 'namespaced-json',
        dest: '../test/l10n',
        keys: []
    });
});

test('should flatten keys on parse', async t => {
    const contents = `
        {
            "NAMESPACE": {
                "KEY": {
                    "FIRST_KEY": "",
                    "SECOND_KEY": "VALUE"
                }
            }
        }
    `;
    const collection: Translations = compiler.parse(contents);
    t.deepEqual(collection.values, {'NAMESPACE.KEY.FIRST_KEY': '', 'NAMESPACE.KEY.SECOND_KEY': 'VALUE' });
});

test('should unflatten keys on compile', async t => {
    const collection = new Translations({
        'NAMESPACE.KEY.FIRST_KEY': '',
        'NAMESPACE.KEY.SECOND_KEY': 'VALUE'
    });
    const result: string = compiler.compile(collection);
    t.deepEqual(result, '{\n\t"NAMESPACE": {\n\t\t"KEY": {\n\t\t\t"FIRST_KEY": "",\n\t\t\t"SECOND_KEY": "VALUE"\n\t\t}\n\t}\n}');
});
