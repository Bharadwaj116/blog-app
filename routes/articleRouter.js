const express = require("express");

const router = express.Router();

const {
  createArticle,
  GetArticle,
  getArticles,
  UpdateArticle,
  DeleteArticle,
  getLatestArticleCards,
  clapArticle,
  unClapArticle,
  // updateArticleViews,
  SearchArticles,
  BookmarkArticle,
  UnBookmarkArticle,
  GetUserBookmarks,
  SearchBookMarkedArticles,
  FilterArticles,
} = require("../controllers/articleController");

const validateToken = require("../middleware/validateTokenHandler");

// const { UserProfileView } = require("../controllers/profileController");

router.route("/create").post(validateToken, createArticle);

router.route("/get").get(getArticles);

router.route("/getlatest").post(validateToken, getLatestArticleCards);

router.route("/").post(validateToken, GetArticle);

router.route("/delete").delete(DeleteArticle);

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
