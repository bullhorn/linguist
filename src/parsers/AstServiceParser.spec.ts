import { test } from 'ava';
import { AstServiceParser } from './AstServiceParser';

class TestAstServiceParser extends AstServiceParser {
	/*public getInstancePropertyName(): string {
		return this._getInstancePropertyName();
	}*/
}

const componentFilename: string = 'test.component.ts';
let parser: TestAstServiceParser;

test.beforeEach(() => {
    parser = new TestAstServiceParser();
});


test('should extract strings in TranslateService\'s get() method', async t => {
    const contents = `
        @Component({ })
        export class AppComponent {
            public constructor(protected _translateService: TranslateService) { }
            public test() {
                this._translateService.get('Hello World');
            }
    `;
    const keys = parser.extract(contents, componentFilename).keys();
    t.deepEqual(keys, ['Hello World']);
});

test('should extract strings in TranslateService\'s instant() method', async t => {
    const contents = `
        @Component({ })
        export class AppComponent {
            public constructor(protected _translateService: TranslateService) { }
            public test() {
                this._translateService.instant('Hello World');
            }
    `;
    const keys = parser.extract(contents, componentFilename).keys();
    t.deepEqual(keys, ['Hello World']);
});

test('should extract array of strings in TranslateService\'s get() method', async t => {
    const contents = `
        @Component({ })
        export class AppComponent {
            public constructor(protected _translateService: TranslateService) { }
            public test() {
                this._translateService.get(['Hello', 'World']);
            }
    `;
    const keys = parser.extract(contents, componentFilename).keys();
    t.deepEqual(keys, ['Hello', 'World']);
});

test('should extract array of strings in TranslateService\'s instant() method', async t => {
    const contents = `
        @Component({ })
        export class AppComponent {
            public constructor(protected _translateService: TranslateService) { }
            public test() {
                this._translateService.instant(['Hello', 'World']);
            }
    `;
    const key = parser.extract(contents, componentFilename).keys();
    t.deepEqual(key, ['Hello', 'World']);
});

test('should not extract strings in get()/instant() methods of other services', async t => {
    const contents = `
        @Component({ })
        export class AppComponent {
            public constructor(
                protected _translateService: TranslateService,
                protected _otherService: OtherService
            ) { }
            public test() {
                this._otherService.get('Hello World');
                this._otherService.instant('Hi there');
            }
    `;
    const keys = parser.extract(contents, componentFilename).keys();
    t.deepEqual(keys, []);
});

test('should extract strings with liberal spacing', async t => {
    const contents = `
        @Component({ })
        export class AppComponent {
            public constructor(
                protected _translateService: TranslateService,
                protected _otherService: OtherService
            ) { }
            public test() {
                this._translateService.instant('Hello');
                this._translateService.get ( 'World' );
                this._translateService.instant ( ['How'] );
                this._translateService.get([ 'Are' ]);
                this._translateService.get([ 'You' , 'Today' ]);
            }
    `;
    const keys = parser.extract(contents, componentFilename).keys();
    t.deepEqual(keys, ['Hello', 'World', 'How', 'Are', 'You', 'Today']);
});

test('should not extract string when not accessing property', async t => {
    const contents = `
        @Component({ })
        export class AppComponent {
            public constructor(protected trans: TranslateService) { }
            public test() {
                trans.get("You are expected at {{time}}", {time: moment.format('H:mm')}).subscribe();
            }
        }
    `;
    const keys = parser.extract(contents, componentFilename).keys();
    t.deepEqual(keys, []);
});

test('should extract string with params on same line', async t => {
    const contents = `
        @Component({ })
        export class AppComponent {
            public constructor(protected _translateService: TranslateService) { }
            public test() {
                this._translateService.get('You are expected at {{time}}', {time: moment.format('H:mm')});
            }
        }
    `;
    const keys = parser.extract(contents, componentFilename).keys();
    t.deepEqual(keys, ['You are expected at {{time}}']);
});
