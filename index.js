//
// A simple dictionary prototype for JavaScript, avoiding common object pitfalls
// and offering some handy convenience methods.
//

/* global module, require, window */

var prefix = "string-dict_";

function makeKey (k) {
    return prefix + k;
}

function revokeKey (k) {
    return k.replace(new RegExp(prefix), "");
}

function Dict (content) {
    
    var key;
    
    this.clear();
    
    if (content) {
        for (key in content) {
            this.set(key, content[key]);
        }
    }
}

Dict.prototype.clear = function () {
    this.items = {};
    this.count = 0;
};

Dict.prototype.length = function () {
    return this.count;
};

Dict.prototype.set = function (k, value) {
    
    var key = makeKey(k);
    
    if (!k) {
        throw new Error("Dictionary keys cannot be falsy.");
    }
    
    if (this.has(key)) {
        this.remove(key);
    }
    
    this.items[key] = value;
    this.count += 1;
    
    return this;
};

Dict.prototype.get = function (k) {
    
    var key = makeKey(k);
    
    if (!this.items.hasOwnProperty(key)) {
        return undefined;
    }
    
    return this.items[key];
};

//
// The same as .get(), but throws when the key doesn't exist.
// This can be useful if you want to use a dict as some sort of registry.
//
Dict.prototype.require = function (key) {
    
    if (!this.has(key)) {
        throw new Error("Required key '" + key + "' does not exist.");
    }
    
    return this.get(key);
};

Dict.prototype.remove = function (k) {
    
    var key = makeKey(k);
    
    if (this.has(k)) {
        delete this.items[key];
        this.count -= 1;
    }
    
    return this;
};

Dict.prototype.has = function (k) {
    
    var key = makeKey(k);
    
    return this.items.hasOwnProperty(key);
};

Dict.prototype.forEach = function (fn) {
    
    if (!fn || typeof fn !== "function") {
        throw new Error("Argument 1 is expected to be of type function.");
    }
    
    for (var key in this.items) {
        fn(this.items[key], revokeKey(key), this);
    }
    
    return this;
};

Dict.prototype.filter = function (fn) {
    
    var matches = new Dict();
    
    this.forEach(function (item, key, all) {
        if (fn(item, key, all)) {
            matches.set(key, item);
        }
    });
    
    return matches;
};

Dict.prototype.find = function (fn) {
    
    var value;
    
    this.some(function (item, key, all) {
        
        if (fn(item, key, all)) {
            value = item;
            return true;
        }
        
        return false;
    });
    
    return value;
};

Dict.prototype.map = function (fn) {
    
    var mapped = new Dict();
    
    this.forEach(function (item, key, all) {
        mapped.set(key, fn(item, key, all));
    });
    
    return mapped;
};

Dict.prototype.reduce = function (fn, initialValue) {
    
    var result = initialValue;
    
    this.forEach(function (item, key, all) {
        result = fn(result, item, key, all);
    });
    
    return result;
};

Dict.prototype.every = function (fn) {
    return this.reduce(function (last, item, key, all) {
        return last && fn(item, key, all);
    }, true);
};

Dict.prototype.some = function (fn) {
    
    for (var key in this.items) {
        if (fn(this.items[key], revokeKey(key), this)) {
            return true;
        }
    }
    
    return false;
};

//
// Returns an array containing the dictionary's keys.
//
Dict.prototype.keys = function () {
    
    var keys = [];
    
    this.forEach(function (item, key) {
        keys.push(key);
    });
    
    return keys;
};

//
// Returns the dictionary's values in an array.
//
Dict.prototype.values = function () {

    var values = [];
    
    this.forEach(function (item) {
        values.push(item);
    });
    
    return values;
};

//
// Creates a normal JS object containing the contents of the dictionary.
//
Dict.prototype.toObject = function () {
    
    var jsObject = {};
    
    this.forEach(function (item, key) {
        jsObject[key] = item;
    });
    
    return jsObject;
};

//
// Creates another dictionary with the same contents as this one.
//
Dict.prototype.clone = function () {
    
    var clone = new Dict();
    
    this.forEach(function (item, key) {
        clone.set(key, item);
    });
    
    return clone;
};

//
// Adds the content of another dictionary to this dictionary's content.
//
Dict.prototype.addMap = function (otherMap) {
    
    var self = this;
    
    otherMap.forEach(function (item, key) {
        self.set(key, item);
    });
    
    return this;
};

//
// Returns a new map which is the result of joining this map
// with another map. This map isn't changed in the process.
// The keys from otherMap will replace any keys from this map that
// are the same.
//
Dict.prototype.join = function (otherMap) {
    return this.clone().addMap(otherMap);
};

module.exports = Dict;
