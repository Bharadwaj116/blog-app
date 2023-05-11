"use strict";

var express = require("express");

var router = express.Router();

var _require = require("../controllers/articleController"),
    createArticle = _require.createArticle,
    GetArticle = _require.GetArticle,
    getArticles = _require.getArticles,
    UpdateArticle = _require.UpdateArticle,
    DeleteArticle = _require.DeleteArticle,
    getLatestArticleCards = _require.getLatestArticleCards,
    clapArticle = _require.clapArticle,
    unClapArticle = _require.unClapArticle,
    SearchArticles = _require.SearchArticles,
    BookmarkArticle = _require.BookmarkArticle,
    UnBookmarkArticle = _require.UnBookmarkArticle,
    GetUserBookmarks = _require.GetUserBookmarks,
    SearchBookMarkedArticles = _require.SearchBookMarkedArticles,
    FilterArticles = _require.FilterArticles;

var validateToken = require("../middleware/validateTokenHandler"); // const { UserProfileView } = require("../controllers/profileController");


router.route("/create").post(validateToken, createArticle);
router.route("/get").get(getArticles);
router.route("/getlatest").get(validateToken, getLatestArticleCards);
router.route("/").post(validateToken, GetArticle);
router.route("/delete")["delete"](DeleteArticle);
router.route("/updatearticle").put(UpdateArticle);
router.route("/clap").post(validateToken, clapArticle);
router.route("/unclap").post(validateToken, unClapArticle);
router.route("/views").post(validateToken, clapArticle);
router.route("/search").post(validateToken, SearchArticles);
router.route("/bookmark").post(validateToken, BookmarkArticle);
router.route("/unbookmark").post(validateToken, UnBookmarkArticle);
router.route("/getbook").post(validateToken, GetUserBookmarks);
router.route("/filter").post(validateToken, FilterArticles);
router.route("/searchbook").post(validateToken, SearchBookMarkedArticles);
module.exports = router;