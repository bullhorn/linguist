import test from 'ava';
import { Check } from '../src/cli/Check';
import { Add } from '../src/cli/Add';

test('this should pass', (t) => {
    t.pass();
});

test('should check for missing keys', async t => {
    const data = new Check().run('en', {
        source: './tmp/**/*',
        dest: './l10n'
    });
    const missing = await data;
    t.is(Object.keys(missing).length, 1);
});

test('should translate locale file to german', async t => {
    const data = new Add().run('en', 'de');
    const translations = await data;
    t.is(translations.greeting, 'Hallo');
});
