"use strict";

var asyncHandler = require("express-async-handler");

var _require = require("googleapis"),
    google = _require.google;

var nodemailer = require("nodemailer");

var dotenv = require("dotenv");

var fs = require("fs").promises; // const { promisify } = require("util");


dotenv.config();
var clientid = process.env.CLIENT_ID;
var clientsecret = process.env.CLIENT_SECRET;
var redirecturi = process.env.REDIRECT_URI;
var refreshtoken = process.env.REFRESH_TOKEN;
var oAuth2Client = new google.auth.OAuth2(clientid, clientsecret, redirecturi);
oAuth2Client.setCredentials({
  refresh_token: refreshtoken
}); // const readFileAsync = promisify(fs.readFile);

var mailSender = asyncHandler(function _callee(req, res) {
  var _req$body, sender, recipient, subject, message, htmlContent, accessToken, transporter, info;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, sender = _req$body.sender, recipient = _req$body.recipient, subject = _req$body.subject, message = _req$body.message;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(fs.readFile("./html/index.html", "utf8"));

        case 4:
          htmlContent = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(oAuth2Client.getAccessToken());

        case 7:
          accessToken = _context.sent;
          transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
              type: 'OAuth2',
              user: "saibharadwaj116@gmail.com",
              clientId: clientid,
              clientSecret: clientsecret,
              refreshToken: refreshtoken,
              accessToken: accessToken
            }
          });
          _context.next = 11;
          return regeneratorRuntime.awrap(transporter.sendMail({
            from: 'Blog App' + sender,
            to: recipient,
            subject: subject,
            text: message,
            html: htmlContent
          }));

        case 11:
          info = _context.sent;
          console.log("Message sent: %s", info.messageId);
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
          res.status(200).json({
            message: "Email sent successfully"
          });
          _context.next = 21;
          break;

        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](1);
          console.error("Error occurred while sending email:", _context.t0);
          res.status(500).json({
            error: "Failed to send email"
          });

        case 21:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 17]]);
});
module.exports = {
  mailSender: mailSender
};