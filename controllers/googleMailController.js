const asyncHandler = require("express-async-handler");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const fs = require("fs").promises;
const User = require("../models/userModel")

dotenv.config();

const clientid = process.env.CLIENT_ID;
const clientsecret = process.env.CLIENT_SECRET;
const redirecturi = process.env.REDIRECT_URI;
const refreshtoken = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  clientid,
  clientsecret,
  redirecturi
);
oAuth2Client.setCredentials({ refresh_token: refreshtoken });

const mailSender = asyncHandler(async (req, res) => {
  const { recipient } = req.body;

  try {
    const htmlContent = await fs.readFile("./html/index.html", "utf8");

    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
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
        accessToken: accessToken,
      },
    });

    const info = await transporter.sendMail({
      from: "BlogIn <saibharadwaj116@gmail.com>",
      to: recipient,
      subject: "Google Gmail Verification Process",
      text: "Google Gmail Verification Succeeded",
      html: htmlContent,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    await User.updateOne({ email: recipient });

    res.status(200).json({
      isverified: true,
      token: accessToken.token,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Error occurred while sending email:", error);

    if (error.code === "ECONNECTION" || error.code === "ETIMEDOUT") {
      res.status(503).json({ error: "Failed to connect to the email server" });
    } else if (error.code === "EAUTH") {
      res.status(401).json({ error: "Email authentication failed" });
    } else {
      res.status(500).json({ error: "Failed to send email" });
    }
  }
});

module.exports = { mailSender };
