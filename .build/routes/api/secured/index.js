"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _routes = _interopRequireDefault(require("./routes.users"));

var api = (0, _express.Router)();
api.use('/users', _routes["default"]);
var _default = api;
exports["default"] = _default;