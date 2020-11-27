"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _typeorm = require("typeorm");

var _insert = require("../fixtures/insert.users");

var _User = _interopRequireDefault(require("./User"));

/* eslint-disable prettier/prettier */
var Database = /*#__PURE__*/function () {
  function Database() {
    (0, _classCallCheck2["default"])(this, Database);
    (0, _defineProperty2["default"])(this, "_connection", null);
  }

  (0, _createClass2["default"])(Database, [{
    key: "authenticate",
    value: function () {
      var _authenticate = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        var founded, _founded, username, password, host, port, database;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _dotenv["default"].config();

                founded = process.env.DATABASE_URL.match(/^(postgres):\/\/(.*):(.*)@(.*):(\d+)\/(.*)$/);

                if (founded) {
                  _context2.next = 4;
                  break;
                }

                throw new Error('Please check your DATABASE_URL value');

              case 4:
                _founded = (0, _slicedToArray2["default"])(founded, 7), username = _founded[2], password = _founded[3], host = _founded[4], port = _founded[5], database = _founded[6];
                _context2.next = 7;
                return (0, _typeorm.createConnection)({
                  type: 'postgres',
                  host: host,
                  port: parseInt(port),
                  username: username,
                  password: password,
                  database: database,
                  entities: [_User["default"]],
                  dropSchema: true,
                  synchronize: true,
                  logging: false
                });

              case 7:
                this._connection = _context2.sent;
                setTimeout( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
                  return _regenerator["default"].wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          (0, _insert.addUser)();

                        case 1:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                })), 4000);
                return _context2.abrupt("return", this._connection);

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function authenticate() {
        return _authenticate.apply(this, arguments);
      }

      return authenticate;
    }()
  }], [{
    key: "getInstance",
    value: function getInstance() {
      if (!Database._instance) {
        Database._instance = new Database();
      }

      return Database._instance;
    }
  }]);
  return Database;
}();

exports["default"] = Database;
(0, _defineProperty2["default"])(Database, "_instance", null);