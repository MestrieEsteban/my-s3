"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = require("express");

var _User = _interopRequireDefault(require("../../../core/models/User"));

var _response = require("../../../core/helpers/response");

var _api = require("../../../core/constants/api");

var api = (0, _express.Router)();
api.get('/:id', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var id, user;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            id = req.params.id;
            _context.next = 4;
            return _User["default"].findOne(id, {
              relations: ['levelId', 'mealId', 'goalId']
            });

          case 4:
            user = _context.sent;
            res.status(_api.CREATED.status).json((0, _response.success)(user));
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](0);
            res.status(_api.BAD_REQUEST.status).json((0, _response.error)(_api.BAD_REQUEST, _context.t0));

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 8]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
var _default = api;
exports["default"] = _default;