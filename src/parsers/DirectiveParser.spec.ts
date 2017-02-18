import test from 'ava';
import { DirectiveParser } from './DirectiveParser';

class TestDirectiveParser extends DirectiveParser {
	public normalizeTemplateAttributes (template: string): string {
		return this._normalizeTemplateAttributes(template);
	}
}

const templateFilename: string = 'test.template.html';
const componentFilename: string = 'test.component.ts';
let parser: TestDirectiveParser;

test.beforeEach(() => {
     parser = new TestDirectiveParser();
});

test('should extract contents when no translate attribute value is provided', async t => {
    const contents = '<div translate>Hello World</div>';
    const keys = parser.extract(contents, templateFilename).keys();
    t.deepEqual(keys, ['Hello World']);
});

test('should extract translate attribute if provided', async t => {
    const contents = '<div translate="KEY">Hello World<div>';
    const keys = parser.extract(contents, templateFilename).keys();
    t.deepEqual(keys, ['KEY']);
});

test('should extract bound translate attribute as key if provided', async t => {
    const contents = `<div [translate]="'KEY'">Hello World<div>`;
    const keys = parser.extract(contents, templateFilename).keys();
    t.deepEqual(keys, ['KEY']);
});

test('should extract direct text nodes when no translate attribute value is provided', async t => {
    const contents = `
        <div translate>
            <span>&#10003;</span>
            Hello <strong>World</strong>
            Hi <em>there</em>
        </div>
    `;
    const keys = parser.extract(contents, templateFilename).keys();
    t.deepEqual(keys, ['Hello', 'Hi']);
});

test('should extract direct text nodes of tags with a translate attribute', async t => {
    const contents = `
        <div translate>
            <span>&#10003;</span>
            Hello World
            <div translate>Hi there</div>
        </div>
    `;
    const keys = parser.extract(contents, templateFilename).keys();
    t.deepEqual(keys, ['Hello World', 'Hi there']);
});

test('should extract translate attribute if provided or direct text nodes if not', async t => {
    const contents = `
        <div translate="KEY">
            <span>&#10003;</span>
            Hello World
            <p translate>Hi there</p>
            <p [translate]="'OTHER_KEY'">Lorem Ipsum</p>
        </div>
    `;
    const keys = parser.extract(contents, templateFilename).keys();
    t.deepEqual(keys, ['KEY', 'Hi there', 'OTHER_KEY']);
});

test('should extract and parse inline template', async t => {
    const contents = `
        @Component({
            selector: 'test',
            template: '<p translate>Hello World</p>'
        })
        export class TestComponent { }
    `;
    const keys = parser.extract(contents, componentFilename).keys();
    t.deepEqual(keys, ['Hello World']);
});

test('should extract contents when no ng2-translate attribute value is provided', async t => {
    const contents = '<div ng2-translate>Hello World</div>';
    const keys = parser.extract(contents, templateFilename).keys();
    t.deepEqual(keys, ['Hello World']);
});

test('should extract ng2-translate attribute if provided', async t => {
    const contents = '<div ng2-translate="KEY">Hello World<div>';
    const keys = parser.extract(contents, templateFilename).keys();
    t.deepEqual(keys, ['KEY']);
});

test('should extract bound ng2-translate attribute as key if provided', async t => {
    const contents = `<div [ng2-translate]="'KEY'">Hello World<div>`;
    const keys = parser.extract(contents, templateFilename).keys();
    t.deepEqual(keys, ['KEY']);
});

test('should not extract translate pipe in html tag', async t => {
    const contents = `<p>{{ 'Audiobooks for personal development' | translate }}</p>`;
    const collection = parser.extract(contents, templateFilename);
    t.deepEqual(collection.values, {});
});

test('should normalize bound attributes', async t => {
    const contents = `<p [translate]="'KEY'">Hello World</p>`;
    const template = parser.normalizeTemplateAttributes(contents);
    t.deepEqual(template, '<p translate="KEY">Hello World</p>');
});
