"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _passport = _interopRequireDefault(require("passport"));

var _passportLocal = require("passport-local");

var _passportJwt = require("passport-jwt");

var _dotenv = _interopRequireDefault(require("dotenv"));

var _User = _interopRequireDefault(require("../models/User"));

_dotenv["default"].config();
/**
 * Local strategy
 */


_passport["default"].use(new _passportLocal.Strategy({
  usernameField: 'email',
  passwordField: 'password'
}, /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(email, password, next) {
    var user;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _User["default"].findOne({
              email: email
            });

          case 3:
            user = _context.sent;

            if (user) {
              _context.next = 7;
              break;
            }

            next("Sorry email ".concat(email, " dosen't exist"), null);
            return _context.abrupt("return");

          case 7:
            if (user.checkPassword(password)) {
              _context.next = 10;
              break;
            }

            next("Sorry password is incorrect", null);
            return _context.abrupt("return");

          case 10:
            next(null, user);
            _context.next = 16;
            break;

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](0);
            next(_context.t0.message);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 13]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}()));
/**
 * JSON Web Token strategy
 */


_passport["default"].use(new _passportJwt.Strategy({
  jwtFromRequest: _passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_ENCRYPTION
}, /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(jwtPayload, next) {
    var id, user;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            id = jwtPayload.id;
            _context2.next = 4;
            return _User["default"].findOne({
              where: {
                id: id
              }
            });

          case 4:
            user = _context2.sent;

            if (user) {
              _context2.next = 8;
              break;
            }

            next("User ".concat(id, " doesn't exist"));
            return _context2.abrupt("return");

          case 8:
            next(null, user);
            _context2.next = 14;
            break;

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2["catch"](0);
            next(_context2.t0.message);

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 11]]);
  }));

  return function (_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}()));