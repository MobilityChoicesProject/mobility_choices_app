export default class ObjectHelper {
    // This makes a copy of the properties of an object. Objects and arrays will only be copied by reference and functions will be ignored entirely.
    static async copyProperties(obj) {
        return Object.assign({}, obj);
    }

    // This makes a deep copy of all properties but without the functions
    // Do not use this function if you need arrays instead of realms list objects. Use therefore the corresponding realm function "deepCopyRealm"
    static async deepCopy(newObject, obj) {
        return await ObjectHelper._deepCopy(newObject, obj, false, false);
    }

    // This makes a deep copy of all properties but without functions
    // This method also ensures that all realm list objects will be processed as arrays.
    static async deepCopyRealm(newObject, obj) {
        return await ObjectHelper._deepCopy(newObject, obj, false, true);
    }

    static async deepCopyWithFunctions(newObject, obj) {
        return await ObjectHelper._deepCopy(newObject, obj, true, false);
    }

    static async _deepCopy(newObject, obj, isCopyFunctionsEnabled, convertRealmListToArray) {
        for (var propertyName in obj) {
            var tmp = obj[propertyName];

            if (ObjectHelper.isFunction(tmp)) {
                if (isCopyFunctionsEnabled) {
                    newObject[propertyName] = tmp;
                }
            } else {
                var type;

                if (ObjectHelper.isArray(tmp)) {
                    // arrays can also contain other objects, functions, ...
                    type = [];
                } else if (convertRealmListToArray && ObjectHelper.isRealmList(tmp)) {
                    type = [];
                } else if ((ObjectHelper.isObject(tmp) || ObjectHelper.isRealmObject(tmp))
                    && ObjectHelper.isEnumerable(tmp)) {
                    // We can only iterate over enumerable objects. All other objects are handled as properties.
                    type = {};
                } else if (ObjectHelper.isRealmObject(tmp)) {
                    type = {};
                }

                if (type != null) {
                    // make a deep copy
                    newObject[propertyName] = await ObjectHelper._deepCopy(type, tmp, isCopyFunctionsEnabled, convertRealmListToArray);
                } else {
                    newObject[propertyName] = tmp;
                }
            }
        }

        return newObject;
    }

    static async flattenObject(newObject, obj) {
        var tmp;

        for (propertyName in obj) {
            tmp = obj[propertyName];

            // ignore functions
            if (!ObjectHelper.isFunction(tmp)) {
                newObject[propertyName] = tmp
            }
        }

        return newObject;
    }

    static getValueOrDefaultString(obj) {
        if (obj) {
            return String(obj);
        }

        return '';
    }

    static isFunction(obj) {
        return typeof (obj) === 'function';
    }

    static isArray(obj) {
        return Array.isArray(obj);
    }

    // an array is also an object
    static isObject(obj) {
        return typeof (obj) === 'object';
    }

    static isEnumerable(obj) {
        //return obj.propertyIsEnumerable(propertyName);
        // checks for null and undefined
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === 'function';
    }

    static isRealmList(obj) {
        return Object.prototype.toString.call(obj) === "[object List]";
    }

    static isRealmObject(obj) {
        return Object.prototype.toString.call(obj) === "[object RealmObject]";
    }
}
