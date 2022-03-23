 // Storage Mock
function storageMock() {
    let storage = {};

    return {
    setItem: function(key, value) {
        storage[key] = value || '';
    },
    getItem: function(key) {
        return key in storage ? storage[key] : null;
    },
    removeItem: function(key) {
        delete storage[key];
    },
    get length() {
        return Object.keys(storage).length;
    },
    key: function(i) {
        const keys = Object.keys(storage);
        return keys[i] || null;
    }
    };
}

localStorage = storageMock();

const utils = require('..');
const assert = require('assert');

utils.LiteStore.add('tasks', 'test1');

assert.deepEqual(utils.LiteStore.getStore(), {tasks: 'test1' });

utils.LiteStore.add('tasks', 'test2');
utils.LiteStore.add('tasks', 'test3');

assert.deepEqual(utils.LiteStore.getStore(), {tasks: ['test1', 'test2', 'test3'] });
assert.deepEqual(utils.LiteStore.getMap()['tasks'], {0: 1, 1: 2, 2: 3});

utils.LiteStore.removeKey('tasks');
assert.deepEqual(utils.LiteStore.getStore(), {});
assert.deepEqual(utils.LiteStore.getMap(), {});
assert.equal(utils.LiteStore.genNewId(), 1);