"use strict";

var asyncHandler = require("express-async-handler");

var User = require("../models/userModel");

var Article = require("../models/articleModel");

var bcrypt = require("bcrypt");

var _ = require("lodash");

var moment = require("moment");

var UserProfileView = asyncHandler(function _callee(request, response) {
  var userId, user, profileimg, username, name, postscount, followerscount, followingcount;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          userId = request.user.id;
          _context.next = 3;
          return regeneratorRuntime.awrap(User.findById(userId).select("profileimage username name posts following followers"));

        case 3:
          user = _context.sent;
          profileimg = user.profileimage;
          username = user.username;
          name = user.name;
          postscount = user.posts.length;
          followerscount = user.followers.length;
          followingcount = user.following.length;
          response.status(200).json({
            profileimg: profileimg,
            username: username,
            name: name,
            postscount: postscount,
            followerscount: followerscount,
            followingcount: followingcount
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  });
});
var AuthorProfileView = asyncHandler(function _callee2(request, response) {
  var userId;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          userId = request.user.id;

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
});
var UpdateUserProfile = asyncHandler(function _callee3(req, res) {
  var userId, updates, user, existingUser, updatedUser;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userId = req.user.id;
          updates = req.body;
          _context3.next = 5;
          return regeneratorRuntime.awrap(User.findById(userId));

        case 5:
          user = _context3.sent;

          if (user) {
            _context3.next = 9;
            break;
          }

          res.status(404);
          throw new Error("User not found");

        case 9:
          if (!(updates.alter_email && updates.alter_email !== user.email)) {
            _context3.next = 15;
            break;
          }

          _context3.next = 12;
          return regeneratorRuntime.awrap(User.findOne({
            alter_email: updates.alter_email
          }));

        case 12:
          existingUser = _context3.sent;

          if (!(existingUser && existingUser._id.toString() !== userId)) {
            _context3.next = 15;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: "Email address already taken"
          }));

        case 15:
          if (!updates.password) {
            _context3.next = 19;
            break;
          }

          _context3.next = 18;
          return regeneratorRuntime.awrap(bcrypt.hash(updates.password, 10));

        case 18:
          updates.password = _context3.sent;

        case 19:
          _context3.next = 21;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(userId, updates, {
            "new": true,
            runValidators: true
          }));

        case 21:
          updatedUser = _context3.sent;
          res.json(updatedUser);

          if (updatedUser) {
            _context3.next = 26;
            break;
          }

          res.status(404);
          throw new Error("User not found");

        case 26:
          _context3.next = 32;
          break;

        case 28:
          _context3.prev = 28;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          res.status(500).json({
            message: "Server error"
          });

        case 32:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 28]]);
});
var NavBarProfile = asyncHandler(function _callee4(request, response) {
  var userId, user, userid, profileimage, username, name, postscount, followerscount, followingcount, bio, profile_tagline, selected_topics, createdMonthYear, user_location, currentUserId, isCurrentUser, isfollowing, currentuser;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          userId = request.user.id;

          if (request.body.userId) {
            userId = request.body.userId;
          }

          _context4.next = 5;
          return regeneratorRuntime.awrap(User.findById(userId).select("_id profileimage username name bio selected_topics createdMonthYear profile_tagline user_location posts followers following profile_tagline selected_topics"));

        case 5:
          user = _context4.sent;

          if (user) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", response.status(404).json({
            message: "User not found"
          }));

        case 8:
          userid = user._id;
          profileimage = user.profileimage;
          username = user.username;
          name = user.name;
          postscount = user.posts.length;
          followerscount = user.followers.length;
          followingcount = user.following.length;
          bio = user.bio;
          profile_tagline = user.profile_tagline;
          selected_topics = user.selected_topics;
          createdMonthYear = user.createdMonthYear;
          user_location = user.user_location;
          currentUserId = request.user.id;
          isCurrentUser = currentUserId.toString() === user._id.toString();
          isfollowing = isCurrentUser ? false : user.followers.some(function (follower) {
            return follower._id.toString() === currentUserId.toString();
          });
          currentuser = isCurrentUser;
          response.json({
            userid: userid,
            isfollowing: isfollowing,
            currentuser: currentuser,
            profileimage: profileimage,
            username: username,
            name: name,
            postscount: postscount,
            followerscount: followerscount,
            followingcount: followingcount,
            bio: bio,
            profile_tagline: profile_tagline,
            selected_topics: selected_topics,
            createdMonthYear: createdMonthYear,
            user_location: user_location
          });
          _context4.next = 31;
          break;

        case 27:
          _context4.prev = 27;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          response.status(500).json({
            message: "Server error"
          });

        case 31:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 27]]);
}); // const RecentActivity = asyncHandler(async (req, res) => {
//   try {
//     const articles = await Article.find({ user_id: req.user.id })
//       .select("article_title createdMonthYear article_sub user_id")
//       .sort({ createdAt: -1 });
//     const articlesByDate = moment(articles.createdMonthYear).format("MMM D");
//     console.log("articledate", articlesByDate);
//     const groupedArticles = _(articles)
//       .groupBy("createdMonthYear")
//       .map((articles, createdMonthYear) => ({
//         createdMonthYear,
//         // user_id: req.user.id, // Add user_id property here
//         data: articles.map(({ _id, article_title }) => ({
//           id: _id,
//           article_title,
//         })),
//       }))
//       .value();
//     res.status(200).json(groupedArticles);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

var RecentActivity = asyncHandler(function _callee5(req, res) {
  var userId, articles, groupedArticles;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          userId = req.user.id;

          if (req.body.userId) {
            userId = req.body.userId;
          }

          _context5.next = 5;
          return regeneratorRuntime.awrap(Article.find({
            user_id: userId
          }).select("article_title createdMonthYear article_sub user_id").sort({
            createdAt: -1
          }));

        case 5:
          articles = _context5.sent;
          groupedArticles = _(articles).groupBy("createdMonthYear").map(function (articles, createdMonthYear) {
            return {
              createdMonthYear: createdMonthYear,
              // user_id: userId,
              data: articles.map(function (_ref) {
                var _id = _ref._id,
                    article_title = _ref.article_title;
                return {
                  id: _id,
                  article_title: article_title
                };
              })
            };
          }).value();
          res.status(200).json(groupedArticles);
          _context5.next = 14;
          break;

        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          res.status(500).json({
            error: "Internal server error"
          });

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
module.exports = {
  AuthorProfileView: AuthorProfileView,
  UserProfileView: UserProfileView,
  NavBarProfile: NavBarProfile,
  UpdateUserProfile: UpdateUserProfile,
  RecentActivity: RecentActivity
};