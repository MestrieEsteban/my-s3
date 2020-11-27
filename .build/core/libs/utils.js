"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mlog = mlog;
exports.prelude = prelude;
exports.argv = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

var _moment = _interopRequireDefault(require("moment"));

var _path = _interopRequireDefault(require("path"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _lodash = require("lodash");

var _fs = require("fs");

var argv = process.argv.slice(2);
exports.argv = argv;

function mlog(str) {
  var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'debug';
  var colors = {
    debug: 'cyan',
    error: 'red',
    warning: 'yellow',
    success: 'green',
    info: 'blue'
  }; // @ts-ignore

  var display = _chalk["default"].bold[colors[level]]("".concat((0, _moment["default"])().format(), " - ").concat(str));

  console.log(display);
}

function prelude() {
  var envPathName = _path["default"].join(process.cwd(), '.env');

  var appConfig = require(_path["default"].join(process.cwd(), 'app.config.json'));

  if (process.env.NODE_ENV === 'production' || (0, _fs.existsSync)(envPathName)) {
    _dotenv["default"].config();

    var missingValues = appConfig.env.filter(function (key) {
      return process.env[key] === undefined;
    });

    if (!(0, _lodash.isEmpty)(missingValues)) {
      throw new Error("Sorry [ ".concat(missingValues.join(', '), "] value(s) are missings on your .env file"));
    }
  } else {
    throw new Error('Sorry your .env file is missing');
  }
}