"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFunction = isFunction;
exports.stableCopy = stableCopy;
exports.getCacheKey = getCacheKey;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* eslint-disable  */
function isFunction(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
}

function stableCopy(value) {
  if (!value || _typeof(value) !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(stableCopy);
  }

  var keys = Object.keys(value).sort();
  var stable = {};

  for (var i = 0; i < keys.length; i++) {
    stable[keys[i]] = stableCopy(value[keys[i]]);
  }

  return stable;
}

function getCacheKey(queryID, variables) {
  return JSON.stringify(stableCopy({
    queryID: queryID,
    variables: variables
  }));
}