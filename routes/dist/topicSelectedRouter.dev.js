"use strict";

var express = require("express");

var router = express.Router();

var _require = require("../controllers/topicSelectedController"),
    chooseTopics = _require.chooseTopics,
    updateSelectedTopics = _require.updateSelectedTopics,
    getUsersBySelectedTopics = _require.getUsersBySelectedTopics,
    getSelectedTopics = _require.getSelectedTopics;

var validateToken = require("../middleware/validateTokenHandler"); // router.use(validateToken);


router.post("/", validateToken, chooseTopics); // router.route("/").post(chooseTopics);

router.route("/update").post(updateSelectedTopics);
router.get("/getuser", validateToken, getUsersBySelectedTopics);
router.get("/getusertopics", validateToken, getSelectedTopics);
module.exports = router;