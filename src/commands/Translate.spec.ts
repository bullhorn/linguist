import test from 'ava';
import { Translate } from './Translate';

// test('should check for missing keys', async t => {
//     const data = new Check().run('en', {
//         source: './tmp/**/*',
//         dest: './l10n'
//     });
//     const missing = await data;
//     t.is(Object.keys(missing).length, 1);
// });

let translator: Translate;

test.beforeEach(() => {
     translator = new Translate();
});

test('should translate locale file to german', async t => {
    const translation = await translator.translate('Hello', 'en', 'de');
    t.is(translation, 'Hallo');
});
