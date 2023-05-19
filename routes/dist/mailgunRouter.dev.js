"use strict";

var express = require("express");

var router = express.Router();

var _require = require("../controllers/googleMailController"),
    mailSender = _require.mailSender;

router.post("/sendemail", mailSender);
module.exports = router;