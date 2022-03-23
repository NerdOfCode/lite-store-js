'use strict';

const _keyStoreName = '_liteStore';
const _keyStoreMapName = '_liteStore_vmap';

/**
 * 
 * @param {*} msg 
 * @returns 
 */
function NonExistentKey(msg) {
    return new Error(msg);
}

class _LiteStore {
    /**
     * 
     * @param {*} keyStoreName 
     * @param {*} strictKeys 
     * @param {*} customIdFunc 
     */
    constructor(keyStoreName = _keyStoreName, strictKeys = false, customIdFunc = null) {
        this.keyStoreName = keyStoreName;
        this.keyStoreMapName = _keyStoreMapName;
        this.strictKeys = strictKeys;
        this.customIdFunc = customIdFunc;
        this.registeredEvents = { add: [this._genMap], remove: [this._genMap], update: [this._genMap] };
        this.currentId = 0;
    }

    /**
     * 
     * @returns 
     */
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

    /**
     * 
     * @returns 
     */
    genNewId() {
        if (this.customIdFunc && typeof this.customIdFunc !== 'undefined') {
            return this.customIdFunc();
        } else {
            return this.currentId += 1;
        }
    }

    /**
     * 
     * @param {*} undefined 
     * @param {*} $this 
     * @returns 
     */
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

    /**
     * 
     */
    parseMap() {
        let currentMap = this.getMap();
    }

    /**
     * 
     * @param {*} type 
     * @param {*} func 
     * @returns 
     */
    registerEvent(type, func) {
        this.registeredEvents[type].push(func);

        return null;
    }

    /**
     * 
     * @param {*} event 
     * @param {*} currentStore 
     * @returns 
     */
    emit(event, currentStore) {
        for (var i = 0, events = this.registeredEvents[event]; i < events.length; i++) {
            events[i](currentStore, this);
        }

        return null;
    }

    /**
     * 
     * @returns 
     */
    getStore() {
        let store = localStorage.getItem(this.keyStoreName);

        if (store && typeof store !== undefined) {
            return JSON.parse(localStorage.getItem(this.keyStoreName));
        }

        this.init();

        return this.getStore();
    }

    /**
     * 
     * @returns 
     */
    getMap() {
        let map = localStorage.getItem(this.keyStoreMapName);

        if (map && typeof map !== undefined) {
            return JSON.parse(localStorage.getItem(this.keyStoreMapName));
        }

        this.init();

        return this.getMap();
    }

    /**
     * 
     * @returns 
     */
    resetMap() {
        this.currentId = 0;
        localStorage.removeItem(this.keyStoreMapName);

        return;
    }

    /**
     * 
     * @param {*} store 
     * @returns 
     */
    updateStore(store) {
        localStorage.setItem(this.keyStoreName, JSON.stringify(store));

        return this.getStore();
    }

    /**
     * 
     * @param {*} map 
     * @returns 
     */    
    updateMap(map) {
        localStorage.setItem(this.keyStoreMapName, JSON.stringify(map));

        return this.getMap();
    }

    /**
     * 
     * @param {*} key 
     * @param {*} val 
     * @param {*} prepend 
     * @returns 
     */
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

    /**
     * 
     * @param {*} map 
     * @param {*} useKey 
     * @returns 
     */
    _findIdx(map = this.getMap(), useKey) {
        let keys = Object.keys(map);

        for (var i = 0; i < keys.length; i++) {
            if (keys[i] == useKey) {
                return keys[i];
            }
        }

        throw NonExistentKey('Unable to locate key in virtual map.');
    }

    /**
     * 
     * @param {*} key 
     * @param {*} objKey 
     * @param {*} newVal 
     */
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

    /**
     * 
     * @param {*} key 
     * @returns 
     */
    get(key) {
        let ret = this.getStore()[key] ?? [];

        return typeof ret === 'string'
            ? [ret]
            : ret;
    }

    /**
     * 
     * @param {*} key 
     * @returns 
     */
    removeKey(key) {
        let currentStore = this.getStore();

        if (key in currentStore) {
            delete currentStore[key];
        }

        this.updateStore(currentStore);
        this.emit('remove', currentStore);

        return;
    }

    /**
     * 
     * @param {*} key 
     * @param {*} idx 
     * @returns 
     */
    remove(key, idx) {
        let currentStore = this.getStore();

        if (key in currentStore) {
            if (typeof currentStore[key][idx] !== 'undefined') {
                delete currentStore[key][idx];
            }
        }

        // Remove newly undefined element
        currentStore[key] = currentStore[key].filter(item => item);

        this.updateStore(currentStore);
        this.emit('remove', currentStore);

        return;
    }
}

export let LiteStore = new _LiteStore().init();