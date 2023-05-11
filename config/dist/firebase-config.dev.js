"use strict";

var admin = require("firebase-admin"); // path to service account


var serviceAccount = require("./ServiceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
module.exports = admin;