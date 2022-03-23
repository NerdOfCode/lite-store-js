'use strict';

const _keyStoreName = '_liteStore';
const _keyStoreMapName = '_liteStore_vmap';

function NonExistentKey(msg) {
    return new Error(msg);
}

class _LiteStore {
    constructor(keyStoreName = _keyStoreName, strictKeys = false, customIdFunc = null) {
        this.keyStoreName = keyStoreName;
        this.keyStoreMapName = _keyStoreMapName;
        this.strictKeys = strictKeys;
        this.customIdFunc = customIdFunc;
        this.registeredEvents = {add: [this._genMap], remove: [this._genMap], update: [this._genMap]};
        this.currentId = 0;
    }

    // init()
    //  check if local store is already initialized,
    //  if not format it up
    init() {
        let keyStore = localStorage.getItem(this.keyStoreName);
        let keyStoreMap = localStorage.getItem(this.keyStoreMapName);

        if (keyStore === null || typeof keyStore === undefined) {
            localStorage.setItem(this.keyStoreName, "{}");
        }

        if (keyStoreMap === null || typeof keyStoreMap === undefined) {
            localStorage.setItem(this.keyStoreMapName, "{}");
        }

        return this;
    }

    genNewId() {
        if (this.customIdFunc && typeof this.customIdFunc !== 'undefined') {
            return this.customIdFunc();
        } else {
            return this.currentId += 1;
        }
    }

    _genMap(undefined, $this = this) {
        let t = $this;

        t.resetMap();

        let currentStore = t.getStore();
        let currentMap = t.getMap();

        for (var key in currentStore) {
            for (var i = 0; i < currentStore[key].length; i++) {
                !(key in currentMap) && (currentMap[key] = {}) && (currentMap[key][i] = '');

                currentMap[key][i] = t.genNewId();
            }
        }

        t.updateMap(currentMap);

        return t.getMap();
    }

    parseMap() {
        let currentMap = this.getMap();
    }

    registerEvent(type, func) {
        this.registeredEvents[type].push(func);

        return null;
    }

    emit(event, currentStore) {
        for (var i = 0, events = this.registeredEvents[event]; i < events.length; i++) {
            events[i](currentStore, this);
        }

        return null;
    }

    getStore() {
        let store = localStorage.getItem(this.keyStoreName);

        if (store && typeof store !== undefined) {
            return JSON.parse(localStorage.getItem(this.keyStoreName));
        }

        this.init();

        return this.getStore();
    }

    getMap() {
        let map = localStorage.getItem(this.keyStoreMapName);

        if (map && typeof map !== undefined) {
            return JSON.parse(localStorage.getItem(this.keyStoreMapName));
        }

        this.init();

        return this.getMap();
    }

    resetMap() {
        this.currentId = 0;
        localStorage.removeItem(this.keyStoreMapName);

        return;
    }

    updateStore(store) {
        localStorage.setItem(this.keyStoreName, JSON.stringify(store));

        return this.getStore();
    }

    updateMap(map) {
        localStorage.setItem(this.keyStoreMapName, JSON.stringify(map));

        return this.getMap();
    }

    add(key, val, prepend = false) {
        let currentStore = this.getStore();

        // Key already exists in store
        if (key in currentStore) {
            if (this.strictKeys) {
                return null;
            }
            
            let existingData = typeof currentStore[key] === 'string'
                ? [currentStore[key]]
                : currentStore[key];

            if (!prepend) {
                currentStore[key] = [...existingData, val];
            } else {
                currentStore[key] = [val, ...existingData];
            }
        } else {
            currentStore[key] = val;
        }

        this.updateStore(currentStore);
        this.emit('add', currentStore);
    }

    _findIdx(map, useKey) {
        let keys = Object.keys(map);

        for (var i = 0; i < keys.length; i++) {
            if (keys[i] == useKey) {
                return keys[i];
            }
        }

        throw NonExistentKey('Unable to locate key in virtual map.');
    }

    update(key, objKey, newVal) {
        let currentStore = this.getStore();
        let currentMap = this.getMap();

        if (key in currentStore && key in currentMap) {
            try {
                currentStore[key][this._findIdx(currentMap[key], objKey)] = newVal;
            } catch (e) {
                throw e; //re-throw for now
            }
        }

        this.updateStore(currentStore);
        this.emit('update', currentStore);
    }

    // Essentially a wrapper over getStore()
    get(key) {
        let ret = this.getStore()[key] ?? [];

        return typeof ret === 'string'
            ? [ret]
            : ret;
    }

    removeKey(key) {
        let currentStore = this.getStore();

        if (key in currentStore) {
            delete currentStore[key];
        }

        this.updateStore(currentStore);
        this.emit('remove', currentStore);

        return;
    }
}

export let LiteStore = new _LiteStore().init();