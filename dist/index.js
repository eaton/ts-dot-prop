"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts_util_is_1 = require("ts-util-is");
/**
 * Regex to find array index notation (example: `myArray[0]`).
 */
var indexer = /([\w]+)\[([\d]+)\]/;
/**
 * Get object property value.
 *
 * @param obj Object to get value from.
 * @param path Dot notation string.
 * @param value Optional default value to return if path is not found.
 */
function get(obj, path, value) {
    var defaultValue = (ts_util_is_1.isDefined(value) ? value : undefined);
    if (!ts_util_is_1.isObject(obj) || !ts_util_is_1.isString(path)) {
        return defaultValue;
    }
    var parts = path.split('.');
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
        var key = parts_1[_i];
        var match = key.match(indexer);
        if (match) {
            // array index notation
            var array = match[1];
            var index = match[2];
            obj = obj[array] && obj[array][index];
        }
        else {
            obj = obj[key];
        }
        if (ts_util_is_1.isUndefined(obj)) {
            return defaultValue;
        }
    }
    return ts_util_is_1.isUndefined(obj) ? defaultValue : obj;
}
exports.get = get;
/**
 * Set object property value.
 *
 * @param obj Object to set value for.
 * @param path Dot notation string.
 * @param value Value to set at path.
 */
function set(obj, path, value) {
    if (!ts_util_is_1.isObject(obj) || !ts_util_is_1.isString(path)) {
        return;
    }
    var parts = path.split('.');
    var last = parts[parts.length - 1];
    for (var _i = 0, parts_2 = parts; _i < parts_2.length; _i++) {
        var key = parts_2[_i];
        var match = key.match(indexer);
        if (match) {
            // array index notation
            var array = match[1];
            var index = parseInt(match[2], 10);
            if (ts_util_is_1.isUndefined(obj[array])) {
                obj = [];
            }
            else {
                obj = obj[array];
            }
            if (ts_util_is_1.isUndefined(obj[index])) {
                obj = {};
            }
            else {
                obj = obj[index];
            }
        }
        else {
            if (ts_util_is_1.isUndefined(obj[key])) {
                obj[key] = {};
            }
            if (key === last) {
                obj[key] = value;
            }
            else {
                obj = obj[key];
            }
        }
    }
}
exports.set = set;
/**
 * Check if object has property value.
 *
 * @param obj Object to set value for.
 * @param path Dot notation string.
 */
function has(obj, path) {
    var value = get(obj, path);
    return ts_util_is_1.isDefined(value);
}
exports.has = has;
/**
 * Delete a property from an object.
 *
 * @param obj Object to set value for.
 * @param path Dot notation string.
 */
function remove(obj, path) {
    if (!ts_util_is_1.isObject(obj) || !ts_util_is_1.isString(path)) {
        return;
    }
    var parts = path.split('.');
    var last = parts[parts.length - 1];
    for (var _i = 0, parts_3 = parts; _i < parts_3.length; _i++) {
        var key = parts_3[_i];
        if (key === last) {
            return delete obj[key];
        }
        var match = key.match(indexer);
        if (match) {
            // array index notation
            var array = match[1];
            var index = match[2];
            obj = obj[array] && obj[array][index];
        }
        else {
            obj = obj[key];
        }
        if (!ts_util_is_1.isObject(obj)) {
            return false;
        }
    }
}
exports.remove = remove;
