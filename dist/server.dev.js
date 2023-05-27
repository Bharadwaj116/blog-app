"use strict";

var express = require("express");

var errorHandler = require("./middleware/ErrorHandler");

var dotenv = require("dotenv").config();

var connectDB = require("./config/dbConnection.js");

connectDB();
var app = express();
var port = process.env.PORT || 5000;
app.use(express.json()); // app.use('/api/blog', require("../blog-backend/routes/BlogRouter"))

app.use("/api/article", require("./routes/articleRouter"));
app.use("/api/users", require("./routes/userRouter"));
app.use("/api/selected", require("./routes/topicSelectedRouter"));
app.use("/api/topic", require("./routes/topicMainRouter"));
app.use("/api/profile", require("./routes/profileRouter"));
app.use("/api/followunfollow", require("./routes/followUnfollowRouter"));
app.use("/api/email", require("./routes/googleMailRouter"));
app.use("/api/github", require("./routes/githubRouter"));
app.use(errorHandler);
app.listen(port, function () {
  console.log("Server running on port ".concat(port));
  console.log("Press Ctrl+C to quit.");
});