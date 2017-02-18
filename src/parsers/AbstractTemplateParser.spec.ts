import test from 'ava';
import { AbstractTemplateParser } from './AbstractTemplateParser';

class TestTemplateParser extends AbstractTemplateParser {
	public isAngularComponent (filePath: string): boolean {
		return this._isAngularComponent(filePath);
	}
	public extractInlineTemplate (contents: string): string {
		return this._extractInlineTemplate(contents);
	}
}


let parser: TestTemplateParser = new TestTemplateParser();

test('should recognize js extension as angular component', async t => {
    const result = parser.isAngularComponent('test.js');
    t.is(result, true);
});

test('should recognize ts extension as angular component', async t => {
    const result = parser.isAngularComponent('test.ts');
    t.is(result, true);
});

test('should not recognize html extension as angular component', async t => {
    const result = parser.isAngularComponent('test.html');
    t.is(result, false);
});

test('should extract inline template', async t => {
    const contents = `
        @Component({
            selector: 'test',
            template: '<p translate>Hello World</p>'
        })
        export class TestComponent { }
    `;
    const template = parser.extractInlineTemplate(contents);
    t.is(template, '<p translate>Hello World</p>');
});

test('should extract inline template spanning multiple lines', async t => {
    const contents = `
        @Component({
            selector: 'test',
            template: '
                <p>
                    Hello World
                </p>
            ',
            styles: ['
                p {
                    color: red;
                }
            ']
        })
        export class TestComponent { }
    `;
    const template = parser.extractInlineTemplate(contents);
    t.is(template, '\n                <p>\n                    Hello World\n                </p>\n            ');
});
