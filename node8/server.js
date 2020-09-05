"use strict";

exports.__esModule = true;
exports.default = void 0;

var _util = require("util");

var _es = require("react-relay-network-modern/es");

var _graphql = require("graphql");

var _utils = require("./utils");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class RelayServerSSR {
  constructor() {
    this.cache = new Map();
  }

  getMiddleware(args) {
    return next => async r => {
      const req = r;
      const cacheKey = (0, _utils.getCacheKey)(req.operation.name, req.variables);
      const cachedResponse = this.cache.get(cacheKey);

      if (cachedResponse) {
        this.log('Get graphql query from cache', cacheKey);
        return _es.RelayNetworkLayerResponse.createFromGraphQL((await cachedResponse));
      }

      this.log('Run graphql query', cacheKey);
      const graphqlArgs = (0, _utils.isFunction)(args) ? await args() : args;
      const hasSchema = graphqlArgs && graphqlArgs.schema;
      const gqlResponse = new Promise(async (resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('RelayRequest timeout'));
        }, 30000);
        let payload = null;

        try {
          if (hasSchema) {
            payload = await (0, _graphql.graphql)(_objectSpread({}, graphqlArgs, {
              source: req.getQueryString(),
              variableValues: req.getVariables()
            }));
          } else {
            payload = await next(r);
          }

          clearTimeout(timeout);
          resolve(payload);
        } catch (e) {
          clearTimeout(timeout);
          reject(e);
        }
      });
      this.cache.set(cacheKey, gqlResponse);
      const res = await gqlResponse;
      this.log('Recieved response for', cacheKey, (0, _util.inspect)(res, {
        colors: true,
        depth: 4
      }));
      return _es.RelayNetworkLayerResponse.createFromGraphQL(res);
    };
  }

  async getCache() {
    this.log('Call getCache() method'); // ensure that async resolution in Routes completes

    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    const arr = [];
    const keys = Array.from(this.cache.keys());

    for (let i = 0; i < keys.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      const payload = await this.cache.get(keys[i]);
      arr.push([keys[i], payload]);
    } // ensure that async resolution inside of QueryRenderer completes


    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    this.log('Recieved all payloads', arr.length);
    return arr;
  }

  log(...args) {
    if (this.debug) {
      console.log('[RelayServerSSR]:', ...args);
    }
  }

}

exports.default = RelayServerSSR;