"use strict";

var asyncHandler = require("express-async-handler");

var nodemailer = require("nodemailer");

var dotenv = require("dotenv");

var fs = require("fs").promises;

var _require = require("util"),
    promisify = _require.promisify;

dotenv.config();
var readFileAsync = promisify(fs.readFile);
var mailSender = asyncHandler(function _callee(req, res) {
  var _req$body, sender, recipient, subject, message, transporter, info;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, sender = _req$body.sender, recipient = _req$body.recipient, subject = _req$body.subject, message = _req$body.message;
          _context.prev = 1;
          // const htmlContent = await readFileAsync("./html/index.html", "utf8");
          transporter = nodemailer.createTransport({
            service: "gmail.googleapis.com",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
              user: "saibharadwaj116@gmail.com",
              pass: "Segussb@116"
            }
          });
          _context.next = 5;
          return regeneratorRuntime.awrap(transporter.sendMail({
            from: "saibharadwaj116@gmail.com",
            to: "ssbmsruas116@gmail.com",
            subject: "hi",
            text: "message" //   html: htmlContent,

          }));

        case 5:
          info = _context.sent;
          console.log("Message sent: %s", info.messageId);
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
          res.status(200).json({
            message: "Email sent successfully"
          });
          _context.next = 15;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](1);
          console.error("Error occurred while sending email:", _context.t0);
          res.status(500).json({
            error: "Failed to send email"
          });

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 11]]);
});
module.exports = {
  mailSender: mailSender
};