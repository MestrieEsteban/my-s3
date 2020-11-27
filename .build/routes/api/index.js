"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _authenticate = _interopRequireDefault(require("./authenticate"));

var _index = _interopRequireDefault(require("./secured/index"));

var _passport = _interopRequireDefault(require("passport"));

var api = (0, _express.Router)();
api.get('/', function (req, res) {
  res.json({
    hello: 'My-s3 Api',
    meta: {
      status: 'running',
      version: '1.0.0'
    }
  });
});
api.use('/authenticate', _authenticate["default"]);
api.use('/', _passport["default"].authenticate('jwt', {
  session: false
}), _index["default"]);
/**
 *
 * /api
 * /api/authenticate/signin
 * /api/authenticate/signup
 * /api/users/[:id] GET | POST | PUT | DELETE
 * /api/users/:userId/posts/[:id] GET | POST | PUT | DELETE
 *
 */

var _default = api;
exports["default"] = _default;