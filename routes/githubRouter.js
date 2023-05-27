const express = require("express");

const router = express.Router();

const {
  callbackGithub,
  authorizeGithub,
} = require("../controllers/githubController");

router.get("/auth", authorizeGithub);
router.get("/callback", callbackGithub);

module.exports = router;
