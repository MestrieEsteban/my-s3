"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

require("reflect-metadata");

var _utils = require("./core/libs/utils");

var _Server = _interopRequireDefault(require("./Server"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var main = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var port, host, server;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            (0, _utils.prelude)();

            _dotenv["default"].config();

            port = _utils.argv[0] || process.env.PORT;
            host = _utils.argv[1] || process.env.HOST;
            server = new _Server["default"](host, parseInt(port, 10));
            _context.next = 8;
            return server.run();

          case 8:
            _context.next = 14;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](0);
            (0, _utils.mlog)(_context.t0.message, 'error');
            process.exit(-1);

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 10]]);
  }));

  return function main() {
    return _ref.apply(this, arguments);
  };
}();

main();