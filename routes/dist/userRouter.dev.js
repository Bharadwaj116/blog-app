"use strict";

var express = require("express");

var _require = require("../controllers/UserController"),
    registerUser = _require.registerUser,
    currentUser = _require.currentUser,
    loginUser = _require.loginUser,
    followUser = _require.followUser,
    unfollowUser = _require.unfollowUser,
    searchUsers = _require.searchUsers,
    getAllUsers = _require.getAllUsers;

var validateToken = require("../middleware/validateTokenHandler");

var router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/get", getAllUsers);
router.get("/current", validateToken, currentUser);
router.post("/follow", validateToken, followUser);
router.post("/unfollow", validateToken, unfollowUser);
router.post("/search", validateToken, searchUsers);
module.exports = router;