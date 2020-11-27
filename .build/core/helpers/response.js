"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.success = success;
exports.error = error;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

/* eslint-disable @typescript-eslint/no-explicit-any */
function success(resource) {
  var _data;

  var meta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var name = resource.constructor.name;
  return {
    data: (_data = {}, (0, _defineProperty2["default"])(_data, name.toLowerCase(), resource.toJSON()), (0, _defineProperty2["default"])(_data, "meta", meta), _data)
  };
}

function error(_ref, err) {
  var status = _ref.status,
      code = _ref.code;
  var description = err.detail ? err.detail : err.message;
  return {
    err: {
      status: status,
      code: code,
      description: description
    }
  };
}