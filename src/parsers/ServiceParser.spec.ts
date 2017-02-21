import test from 'ava';
import { ServiceParser } from './ServiceParser';

class TestServiceParser extends ServiceParser {
	public extractTranslateServiceVar (contents: string): string {
		return this._extractTranslateServiceVar(contents);
	}
}

const componentFilename: string = 'test.component.ts';
let parser: TestServiceParser;

test.beforeEach(() => {
    parser = new TestServiceParser();
});

test('should extract variable used for TranslateService', async t => {
    const contents = `
        @Component({ })
        export class AppComponent {
            public constructor(
                _serviceA: ServiceA,
                public _serviceB: ServiceB,
                protected _translateService: TranslateService
        ) { }
    `;
    const name = parser.extractTranslateServiceVar(contents);
    t.is(name, '_translateService');
});

test('should extract strings in TranslateService\'s translate() method', async t => {
    const contents = `
        @Component({ })
        export class AppComponent {
            public constructor(protected _translateService: TranslateService) { }
            public test() {
                this._translateService.translate('Hello World');
            }
    `;
    const keys = parser.extract(contents, componentFilename).keys();
    t.deepEqual(keys, ['Hello World']);
});

test.skip('should extract array of strings in TranslateService\'s translate() method', async t => {
    const contents = `
        @Component({ })
        export class AppComponent {
            public constructor(protected _translateService: TranslateService) { }
            public test() {
                this._translateService.translate(['Hello', 'World']);
            }
    `;
    const keys = parser.extract(contents, componentFilename).keys();
    t.deepEqual(keys, ['Hello', 'World']);
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
                this._translateService.translate('Hello');
                this._translateService.translate ( "World" );
                this._translateService.translate ( ['How'] );
                this._translateService.translate([ \`Are\` ]);
                this._translateService.translate([ 'You' , 'Today' ]);
            }
    `;
    const keys = parser.extract(contents, componentFilename).keys();
    t.deepEqual(keys, ['Hello', 'World', 'How', 'Are', 'You', 'Today']);
});

test.skip('should not extract string when not accessing property', async t => {
    const contents = `
        @Component({ })
        export class AppComponent {
            public constructor(protected trans: TranslateService) { }
            public test() {
                trans.translate('Hello World');
            }
        }
    `;
    const keys = parser.extract(contents, componentFilename).keys();
    t.deepEqual(keys, []);
});
// FAILS (Use AstServiceParser)
/*test('should extract string with params on same line', async t => {
    const contents = `
        @Component({ })
        export class AppComponent {
            public constructor(protected _translateService: TranslateService) { }
            public test() {
                this._translateService.translate('You are expected at {{time}}', {time: moment.format('H:mm')});
            }
        }
    `;
    const keys = parser.extract(contents, componentFilename).keys();
    t.deepEqual(keys, ['You are expected at {{time}}']);
});*/
