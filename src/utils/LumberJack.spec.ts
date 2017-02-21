import test from 'ava';
import sinon from 'sinon';
import { Logger } from './LumberJack';

test('should display log messages', async t => {
    Logger.log('This is a log.');
    t.pass();
});

test('should display info messages', async t => {
    Logger.info('Here is some informations');
    t.pass();
});

test('should display warning messages', async t => {
    Logger.warn('Warning!!!');
    t.pass();
});

test('should display success messages', async t => {
    Logger.success('You did it!');
    t.pass();
});

test('should display log error messages', async t => {
    Logger.error('Error...');
    t.pass();
});

test('should display spinner', async t => {
    Logger.spin('processing...');
    t.pass();
});

test('should display log error messages', async t => {
    Logger.stop();
    t.pass();
});

test.skip('should clear messages', async t => {
    Logger.clear();
    t.pass();
});
