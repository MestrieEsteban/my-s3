"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = require("express");

var _lodash = require("lodash");

var _response = require("../../core/helpers/response");

var _api = require("../../core/constants/api");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _User = _interopRequireDefault(require("../../core/models/User"));

var _passport = _interopRequireDefault(require("passport"));

var api = (0, _express.Router)();
api.post('/signup', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var fields, missings, isPlural, _req$body, firstname, lastname, email, password, passwordConfirmation, user, payload, token;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            fields = ['firstname', 'lastname', 'email', 'password', 'passwordConfirmation'];
            _context.prev = 1;
            missings = fields.filter(function (field) {
              return !req.body[field];
            });

            if ((0, _lodash.isEmpty)(missings)) {
              _context.next = 6;
              break;
            }

            isPlural = missings.length > 1;
            throw new Error("Field".concat(isPlural ? 's' : '', " [ ").concat(missings.join(', '), " ] ").concat(isPlural ? 'are' : 'is', " missing"));

          case 6:
            _req$body = req.body, firstname = _req$body.firstname, lastname = _req$body.lastname, email = _req$body.email, password = _req$body.password, passwordConfirmation = _req$body.passwordConfirmation;

            if (!(password !== passwordConfirmation)) {
              _context.next = 9;
              break;
            }

            throw new Error("Password doesn't match");

          case 9:
            user = new _User["default"]();
            user.firstname = firstname;
            user.lastname = lastname;
            user.email = email;
            user.password = password;
            _context.next = 16;
            return user.save();

          case 16:
            payload = {
              id: user.id,
              firstname: firstname
            };
            token = _jsonwebtoken["default"].sign(payload, process.env.JWT_ENCRYPTION);
            res.status(_api.CREATED.status).json((0, _response.success)(user, {
              token: token
            }));
            _context.next = 24;
            break;

          case 21:
            _context.prev = 21;
            _context.t0 = _context["catch"](1);
            res.status(_api.BAD_REQUEST.status).json((0, _response.error)(_api.BAD_REQUEST, _context.t0));

          case 24:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 21]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
api.post('/signin', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var authenticate;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            authenticate = _passport["default"].authenticate('local', {
              session: false
            }, function (errorMessage, user) {
              if (errorMessage) {
                res.status(_api.BAD_REQUEST.status).json((0, _response.error)(_api.BAD_REQUEST, new Error(errorMessage)));
                return;
              }

              var payload = {
                id: user.id,
                firstname: user.firstname
              };

              var token = _jsonwebtoken["default"].sign(payload, process.env.JWT_ENCRYPTION);

              res.status(_api.OK.status).json((0, _response.success)(user, {
                token: token
              }));
            });
            authenticate(req, res);

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
var _default = api;
exports["default"] = _default;