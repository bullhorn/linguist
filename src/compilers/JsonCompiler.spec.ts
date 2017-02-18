import test from 'ava';
import { JsonCompiler } from './JsonCompiler';
import { Translations } from '../utils/Translations';

let compiler: JsonCompiler;
test.beforeEach( t => {
    compiler = new JsonCompiler({
        locale: 'en',
        sources: ['../test/tmp'],
        patterns: ['/**/*.html'],
        format: 'json',
        dest: '../test/l10n',
        keys: []
    });
});

test('should convert to json keys on parse', async t => {
    const contents = `
        {
            "FIRST_KEY": "One",
            "SECOND_KEY": "Two"
        }
    `;
    const collection: Translations = compiler.parse(contents);
    t.deepEqual(collection.values, {'FIRST_KEY': 'One', 'SECOND_KEY': 'Two' });
});

test('should stringify on compile', async t => {
    const collection = new Translations({
        'FIRST_KEY': '',
        'SECOND_KEY': 'VALUE'
    });
    const result: string = compiler.compile(collection);
    t.deepEqual(result, '{\n\t"FIRST_KEY": "",\n\t"SECOND_KEY": "VALUE"\n}');
});
