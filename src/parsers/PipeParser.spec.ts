import test from 'ava';
import { PipeParser } from './PipeParser';

const templateFilename: string = 'test.template.html';
let parser: PipeParser;

test.beforeEach(() => {
    parser = new PipeParser();
});

test('should only extract string using pipe', async t => {
    const contents = `<button [style.background]="'lime'">{{ 'SomeKey_NotWorking' | translate }}</button>`;
    const keys = parser.extract(contents, templateFilename).keys();
    t.deepEqual(keys, ['SomeKey_NotWorking']);
});

test('should extract interpolated strings using translate pipe', async t => {
    const contents = `Hello {{ 'World' | translate }}`;
    const keys = parser.extract(contents, templateFilename).keys();
    t.deepEqual(keys, ['World']);
});

test.skip('should extract strings with escaped quotes', async t => {
    const contents = `Hello {{ 'World\'s largest potato' | translate }}`;
    const keys = parser.extract(contents, templateFilename).keys();
    t.deepEqual(keys, [`World's largest potato`]);
});

test('should extract interpolated strings using translate pipe in attributes', async t => {
    const contents = `<span attr="{{ 'Hello World' | translate }}"></span>`;
    const keys = parser.extract(contents, templateFilename).keys();
    t.deepEqual(keys, ['Hello World']);
});

test('should extract bound strings using translate pipe in attributes', async t => {
    const contents = `<span [attr]="'Hello World' | translate"></span>`;
    const keys = parser.extract(contents, templateFilename).keys();
    t.deepEqual(keys, ['Hello World']);
});

test('should not use a greedy regular expression', async t => {
    const contents = `
        <ion-header>
            <ion-navbar color="brand">
                <ion-title>{{ 'Info' | translate }}</ion-title>
            </ion-navbar>
        </ion-header>

        <ion-content>

            <content-loading *ngIf="isLoading">
                {{ 'Loading...' | translate }}
            </content-loading>

        </ion-content>
    `;
    const keys = parser.extract(contents, templateFilename).keys();
    t.deepEqual(keys, ['Info', 'Loading...']);
});

test('should extract strings on same line', async t => {
    const contents = `<span [attr]="'Hello' | translate"></span><span [attr]="'World' | translate"></span>`;
    const keys = parser.extract(contents, templateFilename).keys();
    t.deepEqual(keys, ['Hello', 'World']);
});

test('should extract strings from this template', async t => {
    const contents = `
        <ion-list inset>
            <ion-item>
                <ion-icon item-left name="person" color="dark"></ion-icon>
                <ion-input formControlName="name" type="text" [placeholder]="'Name' | translate"></ion-input>
            </ion-item>
            <ion-item>
                <p color="danger" danger *ngFor="let error of form.get('name').getError('remote')">
                    {{ error }}
                </p>
            </ion-item>
        </ion-list>
        <div class="form-actions">
            test()" color="secondary" block>{{ 'Create account' | translate }}</async ttton>
        </div>
    `;
    const keys = parser.extract(contents, templateFilename).keys();
    t.deepEqual(keys, ['Name', 'Create account']);
});
