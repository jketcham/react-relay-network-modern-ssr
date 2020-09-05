"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _utils = require("./utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var RelayClientSSR =
/*#__PURE__*/
function () {
  function RelayClientSSR(cache) {
    _classCallCheck(this, RelayClientSSR);

    if (Array.isArray(cache)) {
      this.cache = new Map(cache);
    } else {
      this.cache = null;
    }
  }

  _createClass(RelayClientSSR, [{
    key: "getMiddleware",
    value: function getMiddleware(opts) {
      var _this = this;

      return {
        execute: function execute(operation, variables) {
          var cache = _this.cache;

          if (cache) {
            var cacheKey = (0, _utils.getCacheKey)(operation.name, variables);

            if (cache.has(cacheKey)) {
              var payload = cache.get(cacheKey);

              _this.log('SSR_CACHE_GET', cacheKey, payload);

              var lookup = opts && opts.lookup;

              if (!lookup) {
                cache["delete"](cacheKey);

                if (cache.size === 0) {
                  _this.cache = null;
                }
              }

              return payload;
            }

            _this.log('SSR_CACHE_MISS', cacheKey, operation);
          }

          return undefined;
        }
      };
    }
  }, {
    key: "clear",
    value: function clear() {
      if (this.cache) {
        this.cache.clear();
      }
    }
  }, {
    key: "log",
    value: function log() {
      if (this.debug) {
        var _console;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        (_console = console).log.apply(_console, ['[RelayClientSSR]:'].concat(args));
      }
    }
  }]);

  return RelayClientSSR;
}();

exports["default"] = RelayClientSSR;