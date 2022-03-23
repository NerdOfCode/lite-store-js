function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var _keyStoreName = '_liteStore';
var _keyStoreMapName = '_liteStore_vmap';
/**
 * 
 * @param {*} msg 
 * @returns 
 */

function NonExistentKey(msg) {
  return new Error(msg);
}

var _LiteStore = /*#__PURE__*/function () {
  /**
   * 
   * @param {*} keyStoreName 
   * @param {*} strictKeys 
   * @param {*} customIdFunc 
   */
  function _LiteStore() {
    var keyStoreName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _keyStoreName;
    var strictKeys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var customIdFunc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, _LiteStore);

    this.keyStoreName = keyStoreName;
    this.keyStoreMapName = _keyStoreMapName;
    this.strictKeys = strictKeys;
    this.customIdFunc = customIdFunc;
    this.registeredEvents = {
      add: [this._genMap],
      remove: [this._genMap],
      update: [this._genMap]
    };
    this.currentId = 0;
  }
  /**
   * 
   * @returns 
   */


  _createClass(_LiteStore, [{
    key: "init",
    value: function init() {
      var keyStore = localStorage.getItem(this.keyStoreName);
      var keyStoreMap = localStorage.getItem(this.keyStoreMapName);

      if (keyStore === null || _typeof(keyStore) === undefined) {
        localStorage.setItem(this.keyStoreName, "{}");
      }

      if (keyStoreMap === null || _typeof(keyStoreMap) === undefined) {
        localStorage.setItem(this.keyStoreMapName, "{}");
      }

      return this;
    }
    /**
     * 
     * @returns 
     */

  }, {
    key: "genNewId",
    value: function genNewId() {
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

  }, {
    key: "_genMap",
    value: function _genMap(undefined$1) {
      var $this = arguments.length > 1 && arguments[1] !== undefined$1 ? arguments[1] : this;
      var t = $this;
      t.resetMap();
      var currentStore = t.getStore();
      var currentMap = t.getMap();

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

  }, {
    key: "parseMap",
    value: function parseMap() {
      this.getMap();
    }
    /**
     * 
     * @param {*} type 
     * @param {*} func 
     * @returns 
     */

  }, {
    key: "registerEvent",
    value: function registerEvent(type, func) {
      this.registeredEvents[type].push(func);
      return null;
    }
    /**
     * 
     * @param {*} event 
     * @param {*} currentStore 
     * @returns 
     */

  }, {
    key: "emit",
    value: function emit(event, currentStore) {
      for (var i = 0, events = this.registeredEvents[event]; i < events.length; i++) {
        events[i](currentStore, this);
      }

      return null;
    }
    /**
     * 
     * @returns 
     */

  }, {
    key: "getStore",
    value: function getStore() {
      var store = localStorage.getItem(this.keyStoreName);

      if (store && _typeof(store) !== undefined) {
        return JSON.parse(localStorage.getItem(this.keyStoreName));
      }

      this.init();
      return this.getStore();
    }
    /**
     * 
     * @returns 
     */

  }, {
    key: "getMap",
    value: function getMap() {
      var map = localStorage.getItem(this.keyStoreMapName);

      if (map && _typeof(map) !== undefined) {
        return JSON.parse(localStorage.getItem(this.keyStoreMapName));
      }

      this.init();
      return this.getMap();
    }
    /**
     * 
     * @returns 
     */

  }, {
    key: "resetMap",
    value: function resetMap() {
      this.currentId = 0;
      localStorage.removeItem(this.keyStoreMapName);
      return;
    }
    /**
     * 
     * @param {*} store 
     * @returns 
     */

  }, {
    key: "updateStore",
    value: function updateStore(store) {
      localStorage.setItem(this.keyStoreName, JSON.stringify(store));
      return this.getStore();
    }
    /**
     * 
     * @param {*} map 
     * @returns 
     */

  }, {
    key: "updateMap",
    value: function updateMap(map) {
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

  }, {
    key: "add",
    value: function add(key, val) {
      var prepend = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var currentStore = this.getStore(); // Key already exists in store

      if (key in currentStore) {
        if (this.strictKeys) {
          return null;
        }

        var existingData = typeof currentStore[key] === 'string' ? [currentStore[key]] : currentStore[key];

        if (!prepend) {
          currentStore[key] = [].concat(_toConsumableArray(existingData), [val]);
        } else {
          currentStore[key] = [val].concat(_toConsumableArray(existingData));
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

  }, {
    key: "_findIdx",
    value: function _findIdx() {
      var map = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getMap();
      var useKey = arguments.length > 1 ? arguments[1] : undefined;
      var keys = Object.keys(map);

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

  }, {
    key: "update",
    value: function update(key, objKey, newVal) {
      var currentStore = this.getStore();
      var currentMap = this.getMap();

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

  }, {
    key: "get",
    value: function get(key) {
      var _this$getStore$key;

      var ret = (_this$getStore$key = this.getStore()[key]) !== null && _this$getStore$key !== void 0 ? _this$getStore$key : [];
      return typeof ret === 'string' ? [ret] : ret;
    }
    /**
     * 
     * @param {*} key 
     * @returns 
     */

  }, {
    key: "removeKey",
    value: function removeKey(key) {
      var currentStore = this.getStore();

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

  }, {
    key: "remove",
    value: function remove(key, idx) {
      var currentStore = this.getStore();

      if (key in currentStore) {
        if (typeof currentStore[key][idx] !== 'undefined') {
          delete currentStore[key][idx];
        }
      } // Remove newly undefined element


      currentStore[key] = currentStore[key].filter(function (item) {
        return item;
      });
      this.updateStore(currentStore);
      this.emit('remove', currentStore);
      return;
    }
  }]);

  return _LiteStore;
}();

var LiteStore = new _LiteStore().init();

export { LiteStore };
