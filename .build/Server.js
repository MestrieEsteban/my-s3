"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _passport = _interopRequireDefault(require("passport"));

var _utils = require("./core/libs/utils");

var _Database = _interopRequireDefault(require("./core/models/Database"));

require("./core/middlewares/passport");

var _api = _interopRequireDefault(require("./routes/api"));

var Server = /*#__PURE__*/function () {
  function Server(host, port) {
    (0, _classCallCheck2["default"])(this, Server);
    (0, _defineProperty2["default"])(this, "_host", void 0);
    (0, _defineProperty2["default"])(this, "_port", void 0);
    (0, _defineProperty2["default"])(this, "_app", null);
    this._host = host;
    this._port = port;
  }

  (0, _createClass2["default"])(Server, [{
    key: "_initialize",
    value: function () {
      var _initialize2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var db;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                db = _Database["default"].getInstance();
                _context.prev = 1;
                _context.next = 4;
                return db.authenticate();

              case 4:
                _context.next = 10;
                break;

              case 6:
                _context.prev = 6;
                _context.t0 = _context["catch"](1);
                (0, _utils.mlog)(_context.t0.message, 'error');
                process.exit(-1);

              case 10:
                (0, _utils.mlog)('🤩 Database successfully authenticated', 'success');
                this._app = (0, _express["default"])();

                this._app.use(_passport["default"].initialize());

                this._app.use(_bodyParser["default"].json());

                this._app.use(_bodyParser["default"].urlencoded({
                  extended: false
                }));

                this._app.use('/api', _api["default"]);

              case 16:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 6]]);
      }));

      function _initialize() {
        return _initialize2.apply(this, arguments);
      }

      return _initialize;
    }()
  }, {
    key: "run",
    value: function () {
      var _run = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        var _this$_app,
            _this = this;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this._initialize();

              case 2:
                (_this$_app = this._app) === null || _this$_app === void 0 ? void 0 : _this$_app.listen(this._port, function () {
                  (0, _utils.mlog)("\uD83E\uDD20 Server is listening on ".concat(_this._host, ":").concat(_this._port));
                });

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function run() {
        return _run.apply(this, arguments);
      }

      return run;
    }()
  }]);
  return Server;
}();

exports["default"] = Server;