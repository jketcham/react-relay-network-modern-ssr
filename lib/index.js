"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "RelayClientSSR", {
  enumerable: true,
  get: function get() {
    return _client["default"];
  }
});
Object.defineProperty(exports, "RelayServerSSR", {
  enumerable: true,
  get: function get() {
    return _server["default"];
  }
});

var _client = _interopRequireDefault(require("./client"));

var _server = _interopRequireDefault(require("./server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }