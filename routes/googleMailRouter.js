const express = require("express");

const router = express.Router();

const {mailSender} = require("../controllers/googleMailController");

router.post("/sendemail", mailSender);

module.exports = router;