const express = require("express");

const router = express.Router();

const {
  chooseTopics,
  updateSelectedTopics,
  getUsersBySelectedTopics,
  getSelectedTopics,
  getTabBarTopics,
} = require("../controllers/topicSelectedController");

const validateToken = require("../middleware/validateTokenHandler");

// router.use(validateToken);

router.post("/", validateToken, chooseTopics);
// router.route("/").post(chooseTopics);

router.route("/update").post(updateSelectedTopics);

router.get("/getuser", validateToken, getUsersBySelectedTopics);

router.get("/getusertopics", validateToken, getSelectedTopics);

router.get("/gettabtopics", validateToken, getTabBarTopics);

module.exports = router;
