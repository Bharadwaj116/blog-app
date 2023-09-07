"use strict";

var asyncHandler = require("express-async-handler");

var _require = require("googleapis"),
    google = _require.google;

var nodemailer = require("nodemailer");

var dotenv = require("dotenv");

var jwt = require("jsonwebtoken");

var fs = require("fs").promises;

var User = require("../models/userModel");

dotenv.config();
var clientid = process.env.CLIENT_ID;
var clientsecret = process.env.CLIENT_SECRET;
var redirecturi = process.env.REDIRECT_URI;
var refreshtoken = process.env.REFRESH_TOKEN;
var tokenExpiration = process.env.TOKEN_EXPIRATION;
var oAuth2Client = new google.auth.OAuth2(clientid, clientsecret, redirecturi);
oAuth2Client.setCredentials({
  refresh_token: refreshtoken
});
var mailSender = asyncHandler(function _callee(req, res) {
  var recipient, htmlContent, accessToken, transporter, info, user, accesstoken;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          recipient = req.body.recipient;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(fs.readFile("./html/index.html", "utf8"));

        case 4:
          htmlContent = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(oAuth2Client.getAccessToken());

        case 7:
          accessToken = _context.sent;
          console.log("accesstoken", accessToken);
          transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
              type: "OAuth2",
              user: "saibharadwaj116@gmail.com",
              clientId: clientid,
              clientSecret: clientsecret,
              refreshToken: refreshtoken,
              accessToken: accessToken
            }
          });
          _context.next = 12;
          return regeneratorRuntime.awrap(transporter.sendMail({
            from: "BlogIn <saibharadwaj116@gmail.com>",
            to: recipient,
            subject: "Welcome to BlogIn!",
            text: "Google Gmail Verification Succeeded",
            html: htmlContent
          }));

        case 12:
          info = _context.sent;
          console.log("Message sent: %s", info.messageId);
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
          _context.next = 17;
          return regeneratorRuntime.awrap(User.findOne({
            email: recipient
          }));

        case 17:
          user = _context.sent;

          if (user) {
            _context.next = 20;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            error: "User not found"
          }));

        case 20:
          accesstoken = jwt.sign({
            user: {
              name: user.name,
              username: user.username,
              email: user.email,
              id: user.id
            }
          }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: tokenExpiration
          });
          user.token = accesstoken;
          _context.next = 24;
          return regeneratorRuntime.awrap(user.save());

        case 24:
          res.status(200).json({
            isverified: true,
            token: accesstoken,
            message: "Email sent successfully"
          });
          _context.next = 31;
          break;

        case 27:
          _context.prev = 27;
          _context.t0 = _context["catch"](1);
          console.error("Error occurred while sending email:", _context.t0);

          if (_context.t0.code === "ECONNECTION" || _context.t0.code === "ETIMEDOUT") {
            res.status(503).json({
              error: "Failed to connect to the email server"
            });
          } else if (_context.t0.code === "EAUTH") {
            res.status(401).json({
              error: "Email authentication failed"
            });
          } else {
            res.status(500).json({
              error: "Failed to send email"
            });
          }

        case 31:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 27]]);
});
module.exports = {
  mailSender: mailSender
};