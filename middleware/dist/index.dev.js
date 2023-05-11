"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var admin = require("../config/firebase-config");

var Middleware =
/*#__PURE__*/
function () {
  function Middleware() {
    _classCallCheck(this, Middleware);
  }

  _createClass(Middleware, [{
    key: "decodeToken",
    value: function decodeToken(req, res, next) {
      var token, decodeValue;
      return regeneratorRuntime.async(function decodeToken$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              token = req.headers.authorization.split(" ")[1];
              _context.prev = 1;
              _context.next = 4;
              return regeneratorRuntime.awrap(admin.auth().verifyIdToken(token));

            case 4:
              decodeValue = _context.sent;

              if (!decodeValue) {
                _context.next = 8;
                break;
              }

              console.log(decodeValue);
              return _context.abrupt("return", next());

            case 8:
              return _context.abrupt("return", res.json({
                message: "Unauthorized"
              }));

            case 11:
              _context.prev = 11;
              _context.t0 = _context["catch"](1);
              return _context.abrupt("return", res.json({
                message: "Internal Error"
              }));

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[1, 11]]);
    }
  }]);

  return Middleware;
}();

module.exports = new Middleware();