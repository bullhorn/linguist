import test from 'ava';
import { XliffCompiler } from './XliffCompiler';
import { Translations } from '../utils/Translations';

let compiler: XliffCompiler;
test.beforeEach( t => {
    compiler = new XliffCompiler({
        locale: 'en',
        sources: ['../test/tmp'],
        patterns: ['/**/*.html'],
        format: 'xliff',
        dest: '../test/l10n',
        keys: []
    });
});

let XML: string = `<xliff xmlns="urn:oasis:names:tc:xliff:document:1.2" version="1.2">
 <file source-language="en-US" target-language="en-US" datatype="plaintext" original="messages" product-name="@bullhorn/linguist">
  <body>
   <trans-unit id="FIRST_KEY" datatype="html">
    <source>One</source>
    <target/>
   </trans-unit>
   <trans-unit id="SECOND_KEY" datatype="html">
    <source>Two</source>
    <target/>
   </trans-unit>
  </body>
 </file>
</xliff>`;

let KEYS: any = {'FIRST_KEY': 'One', 'SECOND_KEY': 'Two' };

test.skip('should convert to json keys on parse', async t => {
    const collection: Translations = compiler.parse(XML);
    t.deepEqual(collection.values, KEYS);
});

test('should convert to xliff xml on compile', async t => {
    const collection = new Translations(KEYS);
    const result: string = compiler.compile(collection);
    t.deepEqual(result, XML);
});
