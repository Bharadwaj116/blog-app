"use strict";

var express = require("express");

var _require = require("../controllers/profileController"),
    NavBarProfile = _require.NavBarProfile,
    UserProfileView = _require.UserProfileView,
    UpdateUserProfile = _require.UpdateUserProfile,
    RecentActivity = _require.RecentActivity;

var validateToken = require("../middleware/validateTokenHandler");

var router = express.Router();
router.post("/", validateToken, NavBarProfile);
router.get("/user", validateToken, UserProfileView);
router.put("/update", validateToken, UpdateUserProfile);
router.post("/recent", validateToken, RecentActivity);
module.exports = router;