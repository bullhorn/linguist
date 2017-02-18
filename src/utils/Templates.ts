import * as handlebars from 'handlebars';

const translation = '{{toJSON this}}';
export const TRANSLATION = handlebars.compile(translation);

handlebars.registerHelper('toJSON', (object) => {
    return new handlebars.SafeString(JSON.stringify(object, null, 4));
});

const xliff: string = `<?xml version="1.0" encoding="UTF-8" ?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
    <file source-language="{{from}}" target-language="{{to}}" datatype="plaintext" original="messages" date="{{timestamp}}" product-name="{{name}}">
        <body>
        {{#each translations}}
            <trans-unit id="{{key}}" datatype="html">
                <source>{{source}}</source>
                <target>{{target}}</target>{{#if description}}
                <note priority="1" from="description">{{description}}</note>{{/if}}{{#if meaning}}
                <note priority="1" from="meaning">{{meaning}}</note>{{/if}}
            </trans-unit>
        {{/each}}
        </body>
    </file>
</xliff>
`;
export const XLIFF = handlebars.compile(xliff);

const xliff2: string = `<?xml version="1.0" encoding="UTF-8"?>
<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" version="2.0" srcLang="{{from}}" trgLang="{{to}}">
    <file id="f1" original="app">
    {{#translations}}
        <unit id="{{key}}">
            <segment>
                <source>{{source}}</source>
                <target>{{target}}</target>
            </segment>
        </unit>
    {{/translations}}
    </file> 
</xliff> 
`;
export const XLIFF2 = handlebars.compile(xliff2);
