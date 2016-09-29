import handlebars from 'handlebars';

const translation = '{{toJSON this}}';
export const TRANSLATION = handlebars.compile(translation);

handlebars.registerHelper('toJSON', (object) => {
    return new handlebars.SafeString(JSON.stringify(object, null, 4));
});

const xliff = `<?xml version="1.0" encoding="UTF-8"?>
<xliff version="1.0">
    <file source-language="en" target-language="{{target}}" datatype="plaintext" original="messages" date="{{timestamp}}" product-name="app">
        <header/>
        <body>
        {{#translations}}
            <trans-unit id="{{key}}" xml:space="preserve">
                <source>{{source}}</source>
                <target>{{target}}</target>
            </trans-unit>
        {{/translations}}
        </body>
    </file>
</xliff>
`;
export const XLIFF = handlebars.compile(xliff);
