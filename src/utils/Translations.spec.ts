import test from 'ava';
import { Translations } from './Translations';

let collection: Translations;

test.beforeEach(() => {
     collection = new Translations();
});

test('should initialize with key/value pairs', async t => {
    collection = new Translations({ key1: 'val1', key2: 'val2' });
    t.deepEqual(collection.values, { key1: 'val1', key2: 'val2' });
});

test('should add key with value', async t => {
    const newCollection = collection.add('theKey', 'theVal');
    t.deepEqual(newCollection.get('theKey'), 'theVal');
});

test('should add key with default value', async t => {
    collection = collection.add('theKey');
    t.deepEqual(collection.get('theKey'), '');
});

test('should not mutate collection when adding key', async t => {
    collection.add('theKey', 'theVal');
    t.deepEqual(collection.has('theKey'), false);
});

test('should add array of keys with default value', async t => {
    collection = collection.addKeys(['key1', 'key2']);
    t.deepEqual(collection.values, { key1: '', key2: '' });
});

test('should return true when collection has key', async t => {
    collection = collection.add('key');
    t.deepEqual(collection.has('key'), true);
});

test('should return false when collection does not have key', async t => {
    t.deepEqual(collection.has('key'), false);
});

test('should remove key', async t => {
    collection = new Translations({ removeThisKey: '' });
    collection = collection.remove('removeThisKey');
    t.deepEqual(collection.has('removeThisKey'), false);
});

test('should not mutate collection when removing key', async t => {
    collection = new Translations({ removeThisKey: '' });
    collection.remove('removeThisKey');
    t.deepEqual(collection.has('removeThisKey'), true);
});

test('should return number of keys', async t => {
    collection = collection.addKeys(['key1', 'key2', 'key3']);
    t.deepEqual(collection.count(), 3);
});

test('should merge with other collection', async t => {
    collection = collection.add('oldKey', 'oldVal');
    const newCollection = new Translations({ newKey: 'newVal' });
    t.deepEqual(collection.union(newCollection).values, { oldKey: 'oldVal', newKey: 'newVal' });
});

test('should intersect with passed collection', async t => {
    collection = collection.addKeys(['red', 'green', 'blue']);
    const newCollection = new Translations( { red: '', blue: '' });
    t.deepEqual(collection.intersect(newCollection).values, { red: '', blue: '' });
});

test('should intersect with passed collection and keep original values', async t => {
    collection = new Translations({ red: 'rød', green: 'grøn', blue: 'blå' });
    const newCollection = new Translations({ red: 'no value', blue: 'also no value' });
    t.deepEqual(collection.intersect(newCollection).values, { red: 'rød', blue: 'blå' });
});

test('should sort translations in alphabetical order', async t => {
    collection = new Translations({ red: 'rød', green: 'grøn', blue: 'blå' });
    collection = collection.sort();
    t.deepEqual(collection.keys(), ['blue', 'green', 'red']);
});
