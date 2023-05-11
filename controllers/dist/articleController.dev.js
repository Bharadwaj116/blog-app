"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var asyncHandler = require("express-async-handler");

var Article = require("../models/articleModel");

var User = require("../models/userModel");

var Topic = require("../models/topicMainModel");

var getArticles = asyncHandler(function _callee(request, response) {
  var article;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Article.find({}));

        case 2:
          article = _context.sent;
          response.status(200).json(article);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
});
var createArticle = asyncHandler(function _callee2(request, response) {
  var _request$body, article_title, article_desc, article_topic, article_sub, article_image, user, topic, article, post;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log("The request body is :", request.body);
          _request$body = request.body, article_title = _request$body.article_title, article_desc = _request$body.article_desc, article_topic = _request$body.article_topic, article_sub = _request$body.article_sub, article_image = _request$body.article_image;

          if (!(!article_topic || !article_title || !article_desc)) {
            _context2.next = 5;
            break;
          }

          response.status(400);
          throw new Error("All fields are mandatory !");

        case 5:
          _context2.next = 7;
          return regeneratorRuntime.awrap(User.findById(request.user.id));

        case 7:
          user = _context2.sent;
          _context2.next = 10;
          return regeneratorRuntime.awrap(Topic.findOne({
            topic: article_topic[1]
          }));

        case 10:
          topic = _context2.sent;
          article = new Article({
            user_id: request.user.id,
            user_name: user.name,
            user_image: user.profileimage,
            article_title: article_title,
            article_desc: article_desc,
            article_topic: article_topic[1],
            article_sub: article_sub,
            article_image: article_image
          });
          console.log(article);
          post = {
            _id: article._id
          };
          user.posts.push(post);
          console.log(post);

          if (!user.selected_topics.find(function (t) {
            return t._id.equals(topic._id);
          })) {
            user.selected_topics.push({
              _id: topic._id,
              topic: topic.topic,
              color: topic.color,
              icon: topic.icon
            });
          }

          _context2.next = 19;
          return regeneratorRuntime.awrap(Promise.all([user.save(), article.save()]));

        case 19:
          response.status(200).json({
            status: true,
            message: "Article created successfully!"
          });

        case 20:
        case "end":
          return _context2.stop();
      }
    }
  });
});
var GetArticle = asyncHandler(function _callee3(req, res) {
  var articleId, currentUser, article, articleUser, isfollowing, isbookmarked, clappedByCurrentUser, isclapped, user_image, user_name, currentuser, articleWithDetails;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          articleId = req.body.articleId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(User.findById(req.user.id));

        case 4:
          currentUser = _context3.sent;
          _context3.next = 7;
          return regeneratorRuntime.awrap(Article.findById(articleId).select("article_title article_sub article_image article_desc article_topic user_name user_image createdAt user_id article_clap clappedBy").populate("user_id", ["profileimage", "name"]));

        case 7:
          article = _context3.sent;
          _context3.next = 10;
          return regeneratorRuntime.awrap(User.findById(article.user_id._id));

        case 10:
          articleUser = _context3.sent;
          isfollowing = articleUser.following.some(function (follower) {
            return follower._id.toString() === currentUser.id.toString();
          });
          isbookmarked = currentUser.bookmarks.find(function (bookmark) {
            return bookmark._id.toString() === article._id.toString();
          });
          clappedByCurrentUser = article.clappedBy.find(function (clapper) {
            return clapper._id.toString() === currentUser.id.toString();
          });
          isclapped = clappedByCurrentUser ? clappedByCurrentUser.isclapped : false;
          user_image = articleUser.profileimage;
          user_name = articleUser.name;
          currentuser = articleUser._id.toString() === currentUser.id.toString();
          articleWithDetails = _objectSpread({}, article.toObject(), {
            isfollowing: isfollowing,
            isbookmarked: isbookmarked ? isbookmarked.isbookmarked : false,
            currentuser: currentuser,
            isclapped: isclapped,
            user_image: user_image,
            user_name: user_name
          });
          res.status(200).json(articleWithDetails);
          _context3.next = 26;
          break;

        case 22:
          _context3.prev = 22;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          res.status(500).json({
            error: "Internal server error"
          });

        case 26:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 22]]);
});
var UpdateArticle = asyncHandler(function _callee4(req, res) {
  var articleId, updates, article, updatedArticle;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          articleId = req.body.articleId;
          updates = req.body;
          _context4.next = 5;
          return regeneratorRuntime.awrap(Article.findById(articleId));

        case 5:
          article = _context4.sent;

          if (article) {
            _context4.next = 9;
            break;
          }

          res.status(404);
          throw new Error("Article not found");

        case 9:
          _context4.next = 11;
          return regeneratorRuntime.awrap(Article.findByIdAndUpdate(articleId, updates, {
            "new": true,
            runValidators: true
          }));

        case 11:
          updatedArticle = _context4.sent;
          res.json(updatedArticle);

          if (updatedArticle) {
            _context4.next = 16;
            break;
          }

          res.status(404);
          throw new Error("User not found");

        case 16:
          _context4.next = 22;
          break;

        case 18:
          _context4.prev = 18;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          res.status(500).json({
            message: "Server error"
          });

        case 22:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 18]]);
});
var DeleteArticle = asyncHandler(function _callee5(request, response) {
  var user_id;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          console.log("The request body:", request.body);
          user_id = request.body.user_id;

          if (user_id) {
            _context5.next = 5;
            break;
          }

          response.status(400);
          throw new Error("Article Id are Mandatory!");

        case 5:
          response.status(200).json({
            message: "Deleted Article for ".concat(request.params.id)
          });

        case 6:
        case "end":
          return _context5.stop();
      }
    }
  });
});
var getLatestArticleCards = asyncHandler(function _callee7(req, res) {
  return regeneratorRuntime.async(function _callee7$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap(function _callee6() {
            var currentUser, oneDayAgo, articles, _loop, i;

            return regeneratorRuntime.async(function _callee6$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return regeneratorRuntime.awrap(User.findById(req.user.id));

                  case 2:
                    currentUser = _context7.sent;
                    oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
                    _context7.next = 6;
                    return regeneratorRuntime.awrap(Article.find({
                      createdAt: {
                        $gte: oneDayAgo
                      }
                    }).select("article_title article_sub article_image article_desc article_topic user_name user_image createdAt user_id article_clap clappedBy").populate("user_id", ["profileimage", "name"]).sort({
                      createdAt: -1
                    }));

                  case 6:
                    articles = _context7.sent;

                    _loop = function _loop(i) {
                      var authorId, author, user_image, user_name, isfollowing, isbookmarked, currentuser, clappedByCurrentUser, isclapped;
                      return regeneratorRuntime.async(function _loop$(_context6) {
                        while (1) {
                          switch (_context6.prev = _context6.next) {
                            case 0:
                              authorId = articles[i].user_id._id;
                              _context6.next = 3;
                              return regeneratorRuntime.awrap(User.findById(authorId));

                            case 3:
                              author = _context6.sent;
                              user_image = author.profileimage;
                              user_name = author.name;
                              isfollowing = author.followers.some(function (follower) {
                                return follower._id.toString() === currentUser._id.toString();
                              });
                              isbookmarked = currentUser.bookmarks.find(function (bookmark) {
                                return bookmark._id.toString() === articles[i]._id.toString();
                              });
                              currentuser = authorId.toString() === currentUser._id.toString();
                              clappedByCurrentUser = articles[i].clappedBy.find(function (clapper) {
                                return clapper._id.toString() === currentUser._id.toString();
                              });
                              isclapped = clappedByCurrentUser ? clappedByCurrentUser.isclapped : false;
                              articles[i] = _objectSpread({}, articles[i].toObject(), {
                                isfollowing: isfollowing,
                                isbookmarked: isbookmarked ? isbookmarked.isbookmarked : false,
                                currentuser: currentuser,
                                isclapped: isclapped,
                                user_image: user_image,
                                user_name: user_name
                              });

                            case 12:
                            case "end":
                              return _context6.stop();
                          }
                        }
                      });
                    };

                    i = 0;

                  case 9:
                    if (!(i < articles.length)) {
                      _context7.next = 15;
                      break;
                    }

                    _context7.next = 12;
                    return regeneratorRuntime.awrap(_loop(i));

                  case 12:
                    i++;
                    _context7.next = 9;
                    break;

                  case 15:
                    res.status(200).json(articles);

                  case 16:
                  case "end":
                    return _context7.stop();
                }
              }
            });
          }());

        case 3:
          _context8.next = 9;
          break;

        case 5:
          _context8.prev = 5;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          res.status(500).json({
            error: "Internal server error"
          });

        case 9:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 5]]);
});
var clapArticle = asyncHandler(function _callee8(req, res) {
  var articleId, article, user, isAlreadyClapped;
  return regeneratorRuntime.async(function _callee8$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          articleId = req.body.articleId;
          _context9.next = 3;
          return regeneratorRuntime.awrap(Article.findById(articleId));

        case 3:
          article = _context9.sent;

          if (article) {
            _context9.next = 6;
            break;
          }

          return _context9.abrupt("return", res.status(404).json({
            error: "Article not found"
          }));

        case 6:
          _context9.next = 8;
          return regeneratorRuntime.awrap(User.findById(req.user.id));

        case 8:
          user = _context9.sent;

          if (user) {
            _context9.next = 11;
            break;
          }

          return _context9.abrupt("return", res.status(404).json({
            error: "User not found"
          }));

        case 11:
          isAlreadyClapped = article.clappedBy.find(function (clapped) {
            return clapped._id.toString() === user._id.toString();
          });

          if (!isAlreadyClapped) {
            _context9.next = 14;
            break;
          }

          return _context9.abrupt("return", res.status(400).json({
            error: "Article already clapped"
          }));

        case 14:
          if (!isAlreadyClapped) {
            article.clappedBy.push({
              _id: user._id,
              isclapped: true
            });
            article.article_clap++;
          } else {
            article.article_clap--;
          }

          _context9.next = 17;
          return regeneratorRuntime.awrap(article.save());

        case 17:
          res.status(200).json({
            isclapped: true,
            message: "Article clapped successfully"
          });

        case 18:
        case "end":
          return _context9.stop();
      }
    }
  });
});
var unClapArticle = asyncHandler(function _callee9(request, response) {
  var articleId, userId, user, article, clapperIndex, isClapped;
  return regeneratorRuntime.async(function _callee9$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          articleId = request.body.articleId;
          userId = request.user.id;
          _context10.next = 4;
          return regeneratorRuntime.awrap(User.findById(userId));

        case 4:
          user = _context10.sent;
          _context10.next = 7;
          return regeneratorRuntime.awrap(Article.findById(articleId));

        case 7:
          article = _context10.sent;

          if (article) {
            _context10.next = 10;
            break;
          }

          return _context10.abrupt("return", response.status(404).json({
            error: "Article not found"
          }));

        case 10:
          if (user) {
            _context10.next = 12;
            break;
          }

          return _context10.abrupt("return", response.status(404).json({
            error: "User not found"
          }));

        case 12:
          clapperIndex = article.clappedBy.findIndex(function (clapper) {
            return clapper._id.toString() === user._id.toString();
          });

          if (!(clapperIndex === -1)) {
            _context10.next = 15;
            break;
          }

          return _context10.abrupt("return", response.status(400).json({
            error: "User has not clapped this article"
          }));

        case 15:
          isClapped = article.clappedBy[clapperIndex].isclapped;
          article.clappedBy.splice(clapperIndex, 1);

          if (isClapped) {
            article.article_clap--;
          }

          _context10.next = 20;
          return regeneratorRuntime.awrap(article.save());

        case 20:
          response.status(200).json({
            isclapped: false,
            message: "Article unclapped successfully"
          });

        case 21:
        case "end":
          return _context10.stop();
      }
    }
  });
});
var updateArticleViews = asyncHandler(function _callee10(req, res) {
  var _req$body, article_id, user_id, article;

  return regeneratorRuntime.async(function _callee10$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _req$body = req.body, article_id = _req$body.article_id, user_id = _req$body.user_id;
          _context11.next = 4;
          return regeneratorRuntime.awrap(Article.findById(article_id));

        case 4:
          article = _context11.sent;

          if (!article.article_views.includes(user_id)) {
            _context11.next = 7;
            break;
          }

          return _context11.abrupt("return", res.status(400).json({
            error: "Article already viewed"
          }));

        case 7:
          article.article_views.push(user_id);
          article.save();
          res.status(200).json({
            message: "Article views updated successfully"
          });
          _context11.next = 16;
          break;

        case 12:
          _context11.prev = 12;
          _context11.t0 = _context11["catch"](0);
          console.error(_context11.t0);
          res.status(500).json({
            error: "Internal server error"
          });

        case 16:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 12]]);
});
var SearchArticles = asyncHandler(function _callee12(req, res) {
  var _ret;

  return regeneratorRuntime.async(function _callee12$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          _context14.next = 3;
          return regeneratorRuntime.awrap(function _callee11() {
            var query, currentUser, articles, _loop2, i;

            return regeneratorRuntime.async(function _callee11$(_context13) {
              while (1) {
                switch (_context13.prev = _context13.next) {
                  case 0:
                    query = req.body.query;

                    if (!(!query || !query.trim())) {
                      _context13.next = 3;
                      break;
                    }

                    return _context13.abrupt("return", {
                      v: res.status(400).json({
                        success: false,
                        message: "Invalid Query!"
                      })
                    });

                  case 3:
                    _context13.next = 5;
                    return regeneratorRuntime.awrap(User.findById(req.user.id));

                  case 5:
                    currentUser = _context13.sent;
                    _context13.next = 8;
                    return regeneratorRuntime.awrap(Article.find({
                      $or: [{
                        article_title: {
                          $regex: query,
                          $options: "i"
                        }
                      }, {
                        article_sub: {
                          $regex: query,
                          $options: "i"
                        }
                      }, {
                        article_topic: {
                          $regex: query,
                          $options: "i"
                        }
                      }, {
                        user_name: {
                          $regex: query,
                          $options: "i"
                        }
                      }, {
                        "author.username": {
                          $regex: query,
                          $options: "i"
                        }
                      }]
                    }).select("article_title article_sub article_image article_desc article_topic user_name user_image createdAt user_id article_clap clappedBy").sort({
                      createdAt: -1
                    }).populate("user_id", ["profileimage", "name"]).exec());

                  case 8:
                    articles = _context13.sent;

                    if (!(articles.length === 0)) {
                      _context13.next = 11;
                      break;
                    }

                    return _context13.abrupt("return", {
                      v: res.status(404).json({
                        message: "No articles found!"
                      })
                    });

                  case 11:
                    _loop2 = function _loop2(i) {
                      var authorId, author, user_image, user_name, isfollowing, currentuser, clappedByCurrentUser, isclapped;
                      return regeneratorRuntime.async(function _loop2$(_context12) {
                        while (1) {
                          switch (_context12.prev = _context12.next) {
                            case 0:
                              authorId = articles[i].user_id._id;
                              _context12.next = 3;
                              return regeneratorRuntime.awrap(User.findById(authorId));

                            case 3:
                              author = _context12.sent;
                              user_image = author.profileimage;
                              user_name = author.name; // const isfollowing = author.followers.some(
                              //   (follower) => follower._id.toString() === currentUser._id.toString()
                              // );

                              isfollowing = currentUser.following.some(function (following) {
                                return following._id.toString() === authorId.toString();
                              });
                              currentuser = authorId.toString() === req.user.id.toString();
                              clappedByCurrentUser = articles[i].clappedBy.find(function (clapper) {
                                return clapper._id.toString() === currentUser._id.toString();
                              });
                              isclapped = clappedByCurrentUser ? clappedByCurrentUser.isclapped : false;
                              articles[i] = _objectSpread({}, articles[i].toObject(), {
                                isfollowing: isfollowing,
                                currentuser: currentuser,
                                isclapped: isclapped,
                                user_image: user_image,
                                user_name: user_name
                              });

                            case 11:
                            case "end":
                              return _context12.stop();
                          }
                        }
                      });
                    };

                    i = 0;

                  case 13:
                    if (!(i < articles.length)) {
                      _context13.next = 19;
                      break;
                    }

                    _context13.next = 16;
                    return regeneratorRuntime.awrap(_loop2(i));

                  case 16:
                    i++;
                    _context13.next = 13;
                    break;

                  case 19:
                    res.status(200).json(articles);

                  case 20:
                  case "end":
                    return _context13.stop();
                }
              }
            });
          }());

        case 3:
          _ret = _context14.sent;

          if (!(_typeof(_ret) === "object")) {
            _context14.next = 6;
            break;
          }

          return _context14.abrupt("return", _ret.v);

        case 6:
          _context14.next = 12;
          break;

        case 8:
          _context14.prev = 8;
          _context14.t0 = _context14["catch"](0);
          console.error(_context14.t0);
          res.status(500).json({
            success: false,
            message: "Server error"
          });

        case 12:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
var BookmarkArticle = asyncHandler(function _callee13(req, res) {
  var ArticleId, currentUser, article, isAlreadyBookmarked;
  return regeneratorRuntime.async(function _callee13$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          ArticleId = req.body.ArticleId;
          _context15.next = 3;
          return regeneratorRuntime.awrap(User.findById(req.user.id));

        case 3:
          currentUser = _context15.sent;

          if (currentUser) {
            _context15.next = 6;
            break;
          }

          return _context15.abrupt("return", res.status(404).json({
            error: "User not found"
          }));

        case 6:
          _context15.next = 8;
          return regeneratorRuntime.awrap(Article.findById(ArticleId));

        case 8:
          article = _context15.sent;

          if (article) {
            _context15.next = 11;
            break;
          }

          return _context15.abrupt("return", res.status(404).json({
            error: "Article not found"
          }));

        case 11:
          isAlreadyBookmarked = currentUser.bookmarks.find(function (bookmark) {
            return bookmark._id.toString() === ArticleId.toString();
          });

          if (!isAlreadyBookmarked) {
            _context15.next = 14;
            break;
          }

          return _context15.abrupt("return", res.status(400).json({
            error: "Article already bookmarked"
          }));

        case 14:
          currentUser.bookmarks.push({
            _id: ArticleId,
            isbookmarked: true
          });
          _context15.next = 17;
          return regeneratorRuntime.awrap(currentUser.save());

        case 17:
          return _context15.abrupt("return", res.status(200).json({
            isbookemarked: true,
            message: "Article bookmarked successfully"
          }));

        case 18:
        case "end":
          return _context15.stop();
      }
    }
  });
});
var UnBookmarkArticle = asyncHandler(function _callee14(req, res) {
  var ArticleId, currentUser, articleIndex;
  return regeneratorRuntime.async(function _callee14$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          ArticleId = req.body.ArticleId;
          _context16.next = 3;
          return regeneratorRuntime.awrap(User.findById(req.user.id));

        case 3:
          currentUser = _context16.sent;

          if (currentUser) {
            _context16.next = 6;
            break;
          }

          return _context16.abrupt("return", res.status(404).json({
            error: "User not found"
          }));

        case 6:
          articleIndex = currentUser.bookmarks.findIndex(function (bookmark) {
            return bookmark._id.toString() === ArticleId.toString();
          });

          if (!(articleIndex === -1)) {
            _context16.next = 9;
            break;
          }

          return _context16.abrupt("return", res.status(400).json({
            error: "Article not found in bookmarks"
          }));

        case 9:
          currentUser.bookmarks.splice(articleIndex, 1);
          _context16.next = 12;
          return regeneratorRuntime.awrap(currentUser.save());

        case 12:
          return _context16.abrupt("return", res.status(200).json({
            isbookmarked: false,
            message: "Article removed from bookmarks"
          }));

        case 13:
        case "end":
          return _context16.stop();
      }
    }
  });
});
var GetUserBookmarks = asyncHandler(function _callee15(req, res) {
  var currentUser, bookmarkedArticleIds, articles, _loop3, i;

  return regeneratorRuntime.async(function _callee15$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          _context18.next = 2;
          return regeneratorRuntime.awrap(User.findById(req.user.id));

        case 2:
          currentUser = _context18.sent;

          if (currentUser) {
            _context18.next = 5;
            break;
          }

          return _context18.abrupt("return", res.status(404).json({
            error: "User not found"
          }));

        case 5:
          bookmarkedArticleIds = currentUser.bookmarks.filter(function (bookmark) {
            return bookmark.isbookmarked;
          }).map(function (bookmark) {
            return bookmark._id;
          });
          _context18.next = 8;
          return regeneratorRuntime.awrap(Article.find({
            _id: {
              $in: bookmarkedArticleIds
            }
          }).select("article_title article_sub article_image article_desc article_topic createdAt user_id article_clap clappedBy").populate("user_id", ["profileimage", "name"]).sort({
            createdAt: -1
          }).exec());

        case 8:
          articles = _context18.sent;

          _loop3 = function _loop3(i) {
            var authorId, author, user_image, user_name, isfollowing, isbookmarked, currentuser, clappedByCurrentUser, isclapped;
            return regeneratorRuntime.async(function _loop3$(_context17) {
              while (1) {
                switch (_context17.prev = _context17.next) {
                  case 0:
                    authorId = articles[i].user_id._id;
                    _context17.next = 3;
                    return regeneratorRuntime.awrap(User.findById(authorId));

                  case 3:
                    author = _context17.sent;
                    user_image = author.profileimage;
                    user_name = author.name;
                    isfollowing = author.followers.some(function (follower) {
                      return follower._id.toString() === currentUser._id.toString();
                    });
                    isbookmarked = currentUser.bookmarks.find(function (bookmark) {
                      return bookmark._id.toString() === articles[i]._id.toString();
                    });
                    currentuser = authorId.toString() === req.user.id.toString();
                    clappedByCurrentUser = articles[i].clappedBy.find(function (clapper) {
                      return clapper._id.toString() === currentUser._id.toString();
                    });
                    isclapped = clappedByCurrentUser ? clappedByCurrentUser.isclapped : false;
                    articles[i] = _objectSpread({}, articles[i].toObject(), {
                      isfollowing: isfollowing,
                      isbookmarked: isbookmarked ? isbookmarked.isbookmarked : false,
                      currentuser: currentuser,
                      isclapped: isclapped,
                      user_image: user_image,
                      user_name: user_name
                    });

                  case 12:
                  case "end":
                    return _context17.stop();
                }
              }
            });
          };

          i = 0;

        case 11:
          if (!(i < articles.length)) {
            _context18.next = 17;
            break;
          }

          _context18.next = 14;
          return regeneratorRuntime.awrap(_loop3(i));

        case 14:
          i++;
          _context18.next = 11;
          break;

        case 17:
          return _context18.abrupt("return", res.status(200).json(articles));

        case 18:
        case "end":
          return _context18.stop();
      }
    }
  });
});
var SearchBookMarkedArticles = asyncHandler(function _callee17(req, res) {
  var _ret2;

  return regeneratorRuntime.async(function _callee17$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          _context21.prev = 0;
          _context21.next = 3;
          return regeneratorRuntime.awrap(function _callee16() {
            var query, currentUser, bookmarks, articleIds, articles, _loop4, i;

            return regeneratorRuntime.async(function _callee16$(_context20) {
              while (1) {
                switch (_context20.prev = _context20.next) {
                  case 0:
                    query = req.body.query;

                    if (!(!query || !query.trim())) {
                      _context20.next = 3;
                      break;
                    }

                    return _context20.abrupt("return", {
                      v: res.status(400).json({
                        success: false,
                        message: "Invalid Query!"
                      })
                    });

                  case 3:
                    _context20.next = 5;
                    return regeneratorRuntime.awrap(User.findById(req.user.id).populate("bookmarks"));

                  case 5:
                    currentUser = _context20.sent;
                    bookmarks = currentUser.bookmarks.filter(function (bookmark) {
                      return bookmark.isbookmarked;
                    });
                    articleIds = bookmarks.map(function (bookmark) {
                      return bookmark._id;
                    });
                    _context20.next = 10;
                    return regeneratorRuntime.awrap(Article.find({
                      _id: {
                        $in: articleIds
                      },
                      $or: [{
                        article_topic: {
                          $regex: query,
                          $options: "i"
                        }
                      }, {
                        article_title: {
                          $regex: query,
                          $options: "i"
                        }
                      }, {
                        user_name: {
                          $regex: query,
                          $options: "i"
                        }
                      }]
                    }).select("article_title article_sub article_image article_desc article_topic user_name user_image createdAt user_id article_clap clappedBy").sort({
                      createdAt: -1
                    }).exec());

                  case 10:
                    articles = _context20.sent;

                    if (!(articles.length === 0)) {
                      _context20.next = 13;
                      break;
                    }

                    return _context20.abrupt("return", {
                      v: res.status(404).json({
                        message: "No authors found!"
                      })
                    });

                  case 13:
                    _loop4 = function _loop4(i) {
                      var authorId, author, isfollowing, isbookmarked, currentuser, clappedByCurrentUser, isclapped;
                      return regeneratorRuntime.async(function _loop4$(_context19) {
                        while (1) {
                          switch (_context19.prev = _context19.next) {
                            case 0:
                              authorId = articles[i].user_id;
                              _context19.next = 3;
                              return regeneratorRuntime.awrap(User.findById(authorId));

                            case 3:
                              author = _context19.sent;
                              // const isfollowing = author.followers.some(
                              //   (follower) => follower._id.toString() === currentUser._id.toString()
                              // );
                              isfollowing = currentUser.following.some(function (following) {
                                return following._id.toString() === authorId.toString();
                              });
                              isbookmarked = currentUser.bookmarks.find(function (bookmark) {
                                return bookmark._id.toString() === articles[i]._id.toString();
                              });
                              currentuser = authorId.toString() === req.user.id.toString();
                              clappedByCurrentUser = articles[i].clappedBy.find(function (clapper) {
                                return clapper._id.toString() === currentUser._id.toString();
                              });
                              isclapped = clappedByCurrentUser ? clappedByCurrentUser.isclapped : false;
                              articles[i] = _objectSpread({}, articles[i].toObject(), {
                                isfollowing: isfollowing,
                                isbookmarked: isbookmarked ? isbookmarked.isbookmarked : false,
                                currentuser: currentuser,
                                isclapped: isclapped
                              });

                            case 10:
                            case "end":
                              return _context19.stop();
                          }
                        }
                      });
                    };

                    i = 0;

                  case 15:
                    if (!(i < articles.length)) {
                      _context20.next = 21;
                      break;
                    }

                    _context20.next = 18;
                    return regeneratorRuntime.awrap(_loop4(i));

                  case 18:
                    i++;
                    _context20.next = 15;
                    break;

                  case 21:
                    res.status(200).json(articles);

                  case 22:
                  case "end":
                    return _context20.stop();
                }
              }
            });
          }());

        case 3:
          _ret2 = _context21.sent;

          if (!(_typeof(_ret2) === "object")) {
            _context21.next = 6;
            break;
          }

          return _context21.abrupt("return", _ret2.v);

        case 6:
          _context21.next = 12;
          break;

        case 8:
          _context21.prev = 8;
          _context21.t0 = _context21["catch"](0);
          console.error(_context21.t0);
          res.status(500).json({
            success: false,
            message: "Server Error!"
          });

        case 12:
        case "end":
          return _context21.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
var FilterArticles = asyncHandler(function _callee19(req, res) {
  return regeneratorRuntime.async(function _callee19$(_context24) {
    while (1) {
      switch (_context24.prev = _context24.next) {
        case 0:
          _context24.prev = 0;
          _context24.next = 3;
          return regeneratorRuntime.awrap(function _callee18() {
            var article_topic, currentUser, articles, _loop5, i;

            return regeneratorRuntime.async(function _callee18$(_context23) {
              while (1) {
                switch (_context23.prev = _context23.next) {
                  case 0:
                    article_topic = req.body.article_topic;
                    _context23.next = 3;
                    return regeneratorRuntime.awrap(User.findById(req.user.id));

                  case 3:
                    currentUser = _context23.sent;
                    _context23.next = 6;
                    return regeneratorRuntime.awrap(Article.find({
                      article_topic: article_topic
                    }).select("article_title article_sub article_image article_desc article_topic createdAt user_id article_clap clappedBy").populate("user_id", ["profileimage", "name"]).sort({
                      createdAt: -1
                    }).exec());

                  case 6:
                    articles = _context23.sent;

                    _loop5 = function _loop5(i) {
                      var authorId, author, user_image, user_name, isfollowing, isbookmarked, currentuser, clappedByCurrentUser, isclapped;
                      return regeneratorRuntime.async(function _loop5$(_context22) {
                        while (1) {
                          switch (_context22.prev = _context22.next) {
                            case 0:
                              authorId = articles[i].user_id._id;
                              _context22.next = 3;
                              return regeneratorRuntime.awrap(User.findById(authorId));

                            case 3:
                              author = _context22.sent;
                              user_image = author.profileimage;
                              user_name = author.name;
                              isfollowing = author.followers.some(function (follower) {
                                return follower._id.toString() === currentUser._id.toString();
                              });
                              isbookmarked = currentUser.bookmarks.find(function (bookmark) {
                                return bookmark._id.toString() === articles[i]._id.toString();
                              });
                              currentuser = authorId.toString() === req.user.id.toString();
                              clappedByCurrentUser = articles[i].clappedBy.find(function (clapper) {
                                return clapper._id.toString() === currentUser._id.toString();
                              });
                              isclapped = clappedByCurrentUser ? clappedByCurrentUser.isclapped : false;
                              articles[i] = _objectSpread({}, articles[i].toObject(), {
                                isfollowing: isfollowing,
                                isbookmarked: isbookmarked ? isbookmarked.isbookmarked : false,
                                currentuser: currentuser,
                                isclapped: isclapped,
                                user_image: user_image,
                                user_name: user_name
                              });

                            case 12:
                            case "end":
                              return _context22.stop();
                          }
                        }
                      });
                    };

                    i = 0;

                  case 9:
                    if (!(i < articles.length)) {
                      _context23.next = 15;
                      break;
                    }

                    _context23.next = 12;
                    return regeneratorRuntime.awrap(_loop5(i));

                  case 12:
                    i++;
                    _context23.next = 9;
                    break;

                  case 15:
                    res.status(200).json(articles);

                  case 16:
                  case "end":
                    return _context23.stop();
                }
              }
            });
          }());

        case 3:
          _context24.next = 8;
          break;

        case 5:
          _context24.prev = 5;
          _context24.t0 = _context24["catch"](0);
          console.error(_context24.t0);

        case 8:
        case "end":
          return _context24.stop();
      }
    }
  }, null, null, [[0, 5]]);
});
module.exports = {
  createArticle: createArticle,
  GetArticle: GetArticle,
  getArticles: getArticles,
  UpdateArticle: UpdateArticle,
  DeleteArticle: DeleteArticle,
  getLatestArticleCards: getLatestArticleCards,
  clapArticle: clapArticle,
  unClapArticle: unClapArticle,
  updateArticleViews: updateArticleViews,
  SearchArticles: SearchArticles,
  BookmarkArticle: BookmarkArticle,
  UnBookmarkArticle: UnBookmarkArticle,
  GetUserBookmarks: GetUserBookmarks,
  SearchBookMarkedArticles: SearchBookMarkedArticles,
  FilterArticles: FilterArticles
};