"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = require("util");

var _es = require("react-relay-network-modern/es");

var _graphql = require("graphql");

var _utils = require("./utils");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

class RelayServerSSR {
  constructor() {
    this.cache = new Map();
  }

  getMiddleware(args) {
    var _this = this;

    return next =>
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(function* (r) {
        const req = r;
        const cacheKey = (0, _utils.getCacheKey)(req.operation.name, req.variables);

        const cachedResponse = _this.cache.get(cacheKey);

        if (cachedResponse) {
          _this.log('Get graphql query from cache', cacheKey);

          return _es.RelayNetworkLayerResponse.createFromGraphQL((yield cachedResponse));
        }

        _this.log('Run graphql query', cacheKey);

        const graphqlArgs = (0, _utils.isFunction)(args) ? yield args() : args;
        const hasSchema = graphqlArgs && graphqlArgs.schema;
        const gqlResponse = new Promise(
        /*#__PURE__*/
        function () {
          var _ref2 = _asyncToGenerator(function* (resolve, reject) {
            const timeout = setTimeout(() => {
              reject(new Error('RelayRequest timeout'));
            }, 30000);
            let payload = null;

            try {
              if (hasSchema) {
                payload = yield (0, _graphql.graphql)(_objectSpread({}, graphqlArgs, {
                  source: req.getQueryString(),
                  variableValues: req.getVariables()
                }));
              } else {
                payload = yield next(r);
              }

              clearTimeout(timeout);
              resolve(payload);
            } catch (e) {
              clearTimeout(timeout);
              reject(e);
            }
          });

          return function (_x2, _x3) {
            return _ref2.apply(this, arguments);
          };
        }());

        _this.cache.set(cacheKey, gqlResponse);

        const res = yield gqlResponse;

        _this.log('Recieved response for', cacheKey, (0, _util.inspect)(res, {
          colors: true,
          depth: 4
        }));

        return _es.RelayNetworkLayerResponse.createFromGraphQL(res);
      });

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }();
  }

  getCache() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      _this2.log('Call getCache() method'); // ensure that async resolution in Routes completes


      yield new Promise(resolve => {
        setTimeout(resolve, 0);
      });
      const arr = [];
      const keys = Array.from(_this2.cache.keys());

      for (let i = 0; i < keys.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        const payload = yield _this2.cache.get(keys[i]);
        arr.push([keys[i], payload]);
      } // ensure that async resolution inside of QueryRenderer completes


      yield new Promise(resolve => {
        setTimeout(resolve, 0);
      });

      _this2.log('Recieved all payloads', arr.length);

      return arr;
    })();
  }

  log(...args) {
    if (this.debug) {
      console.log('[RelayServerSSR]:', ...args);
    }
  }

}

exports.default = RelayServerSSR;