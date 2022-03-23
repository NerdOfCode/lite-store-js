localStorage = require('./specHelper.js')();

const utils = require('..');
const assert = require('assert');

utils.LiteStore.add('tasks', 'test1');

assert.deepEqual(utils.LiteStore.getStore(), {tasks: 'test1' });

utils.LiteStore.add('tasks', 'test2');
utils.LiteStore.add('tasks', 'test3');

assert.deepEqual(utils.LiteStore.getStore(), {tasks: ['test1', 'test2', 'test3']});
assert.deepEqual(utils.LiteStore.getMap()['tasks'], {0: 1, 1: 2, 2: 3});

utils.LiteStore.remove('tasks', utils.LiteStore.get('tasks').indexOf('test3'));
assert.notDeepEqual(utils.LiteStore.getStore(), {tasks: ['test1', 'test2', 'test3']});
assert.deepEqual(utils.LiteStore.getStore(), {tasks: ['test1', 'test2']});

utils.LiteStore.removeKey('tasks');
assert.deepEqual(utils.LiteStore.getStore(), {});
assert.deepEqual(utils.LiteStore.getMap(), {});
assert.equal(utils.LiteStore.genNewId(), 1);
