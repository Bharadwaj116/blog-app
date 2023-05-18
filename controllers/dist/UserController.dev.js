"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var asyncHandler = require("express-async-handler");

var bcrypt = require("bcrypt");

var jwt = require("jsonwebtoken");

var User = require("../models/userModel"); // const regex = new RegExp(`^${searchTerm}`, 'i');


var registerUser = asyncHandler(function _callee(request, response) {
  var _request$body, name, username, email, password, userAvailable, hashedPassword, user;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _request$body = request.body, name = _request$body.name, username = _request$body.username, email = _request$body.email, password = _request$body.password;

          if (!(!username || !email || !password)) {
            _context.next = 4;
            break;
          }

          response.status(400);
          throw new Error("All fields are mandatory!");

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 6:
          userAvailable = _context.sent;

          if (!userAvailable) {
            _context.next = 10;
            break;
          }

          response.status(400);
          throw new Error("User already registered!");

        case 10:
          _context.next = 12;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 12:
          hashedPassword = _context.sent;
          console.log("Hashed Password: ", hashedPassword);
          user = new User({
            name: name,
            username: username,
            email: email,
            password: hashedPassword
          });
          console.log(user);

          if (!user) {
            _context.next = 22;
            break;
          }

          _context.next = 19;
          return regeneratorRuntime.awrap(user.save());

        case 19:
          response.status(200).json({
            message: "Registered Successfully!",
            _id: user.id,
            email: user.email,
            bio: user.bio
          });
          _context.next = 24;
          break;

        case 22:
          response.status(400);
          throw new Error("User data is not valid");

        case 24:
          response.json({
            message: "Register the user"
          });

        case 25:
        case "end":
          return _context.stop();
      }
    }
  });
});
var loginUser = asyncHandler(function _callee2(request, response) {
  var _request$body2, email, password, user, accessToken;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _request$body2 = request.body, email = _request$body2.email, password = _request$body2.password;

          if (!(!email || !password)) {
            _context2.next = 4;
            break;
          }

          response.status(400);
          throw new Error("All fields are mandatory!");

        case 4:
          if (!/^@/.test(email)) {
            _context2.next = 10;
            break;
          }

          _context2.next = 7;
          return regeneratorRuntime.awrap(User.findOne({
            username: email
          }));

        case 7:
          user = _context2.sent;
          _context2.next = 18;
          break;

        case 10:
          if (!(email != /^@/.test(email))) {
            _context2.next = 16;
            break;
          }

          _context2.next = 13;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 13:
          user = _context2.sent;
          _context2.next = 18;
          break;

        case 16:
          response.status(401);
          throw new Error("Invalid username or password");

        case 18:
          _context2.t0 = user;

          if (!_context2.t0) {
            _context2.next = 23;
            break;
          }

          _context2.next = 22;
          return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

        case 22:
          _context2.t0 = _context2.sent;

        case 23:
          if (!_context2.t0) {
            _context2.next = 28;
            break;
          }

          accessToken = jwt.sign({
            user: {
              name: user.name,
              username: user.username,
              email: user.email,
              id: user.id
            }
          }, process.env.ACCESS_TOKEN_SECERT, {
            expiresIn: "10080m"
          });
          response.status(200).json({
            accessToken: accessToken,
            message: "Login Successfully!"
          });
          _context2.next = 30;
          break;

        case 28:
          response.status(401);
          throw new Error("Invalid email or password");

        case 30:
        case "end":
          return _context2.stop();
      }
    }
  });
});
var currentUser = asyncHandler(function _callee3(request, response) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          response.json(request.user);

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
});
var followUser = asyncHandler(function _callee4(request, response) {
  var userId, followerId, followerUsername, user, follower, currentUser, isAlreadyFollowing;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          userId = request.body.userId;
          followerId = request.user.id;
          followerUsername = request.user.username;
          _context4.next = 5;
          return regeneratorRuntime.awrap(User.findById(userId));

        case 5:
          user = _context4.sent;
          follower = {
            _id: followerId,
            username: followerUsername,
            isfollowing: true
          };

          if (user) {
            _context4.next = 10;
            break;
          }

          response.status(404);
          throw new Error("User not found");

        case 10:
          user.followers.push(follower);
          console.log("follower", follower);
          _context4.next = 14;
          return regeneratorRuntime.awrap(User.findById(followerId));

        case 14:
          currentUser = _context4.sent;
          isAlreadyFollowing = currentUser.following.some(function (following) {
            return following._id.toString() === userId.toString();
          });

          if (isAlreadyFollowing) {
            _context4.next = 20;
            break;
          }

          currentUser.following.push({
            _id: userId,
            username: user.username,
            isfollowing: true
          });
          _context4.next = 20;
          return regeneratorRuntime.awrap(currentUser.save());

        case 20:
          _context4.next = 22;
          return regeneratorRuntime.awrap(user.save());

        case 22:
          response.status(200).json({
            isfollowing: true,
            message: "You have followed ".concat(user.username)
          });

        case 23:
        case "end":
          return _context4.stop();
      }
    }
  });
});
var unfollowUser = asyncHandler(function _callee5(request, response) {
  var userId, followerId, user, follower;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          userId = request.body.userId;
          followerId = request.user.id;
          _context5.next = 4;
          return regeneratorRuntime.awrap(User.findById(userId));

        case 4:
          user = _context5.sent;
          _context5.next = 7;
          return regeneratorRuntime.awrap(User.findById(followerId));

        case 7:
          follower = _context5.sent;

          if (user) {
            _context5.next = 11;
            break;
          }

          response.status(404);
          throw new Error("User not found");

        case 11:
          if (follower) {
            _context5.next = 14;
            break;
          }

          response.status(404);
          throw new Error("follower not found");

        case 14:
          user.followers.some(function (sub) {
            return sub._id.toString() === followerId.toString();
          });
          user.followers = user.followers.filter(function (sub) {
            return sub._id.toString() !== followerId.toString();
          });
          _context5.next = 18;
          return regeneratorRuntime.awrap(user.save());

        case 18:
          follower.following.some(function (follow) {
            return follow._id.toString() === userId.toString();
          });
          follower.following = follower.following.filter(function (follow) {
            return follow._id.toString() !== userId.toString();
          });
          _context5.next = 22;
          return regeneratorRuntime.awrap(follower.save());

        case 22:
          response.status(200).json({
            isfollowing: false,
            message: "You have followed ".concat(user.username)
          });

        case 23:
        case "end":
          return _context5.stop();
      }
    }
  });
}); // const searchUsers = asyncHandler(async (req, res) => {
//   try {
//     const { query } = req.body;
//     if (!query || !query.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid Query!",
//       });
//     }
//     const currentUser = await User.findById(req.user.id).populate(
//       "selected_topics"
//     );
//     const users = await User.find({
//       $or: [
//         { name: { $regex: query, $options: "i" } },
//         { username: { $regex: query, $options: "i" } },
//       ],
//     })
//       .select("profileimage username name selected_topics")
//       .exec();
//     if (users.length === 0) {
//       return res.status(404).json({
//         message: "No authors found!",
//       });
//     }
//     const filteredUsers = users
//       .filter((user) => user._id.toString() !== currentUser._id.toString())
//       .map((user) => {
//         const selectedTopics = user.selected_topics.map((topic) => topic.topic);
//         const isFollowing = currentUser.following.some(
//           (following) => following._id.toString() === user._id.toString()
//         );
//         return {
//           ...user.toObject(),
//           selected_topics: selectedTopics,
//           isfollowing: isFollowing,
//         };
//       });
//     res.status(200).json(filteredUsers);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

var searchUsers = asyncHandler(function _callee6(req, res) {
  var query, _currentUser, usersByUsername, usersByName, mergedUsers, uniqueUsers, filteredUsers;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          query = req.body.query;

          if (!(!query || !query.trim())) {
            _context6.next = 4;
            break;
          }

          return _context6.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid Query!"
          }));

        case 4:
          _context6.next = 6;
          return regeneratorRuntime.awrap(User.findById(req.user.id).populate("selected_topics"));

        case 6:
          _currentUser = _context6.sent;
          _context6.next = 9;
          return regeneratorRuntime.awrap(User.find({
            username: {
              $regex: query,
              $options: "i"
            }
          }).select("profileimage username name selected_topics").exec());

        case 9:
          usersByUsername = _context6.sent;
          _context6.next = 12;
          return regeneratorRuntime.awrap(User.find({
            name: {
              $regex: query,
              $options: "i"
            }
          }).select("profileimage username name selected_topics").exec());

        case 12:
          usersByName = _context6.sent;
          mergedUsers = [].concat(_toConsumableArray(usersByUsername), _toConsumableArray(usersByName)); // Remove duplicates

          uniqueUsers = mergedUsers.filter(function (user, index, self) {
            return index === self.findIndex(function (u) {
              return u._id.toString() === user._id.toString();
            });
          });

          if (!(uniqueUsers.length === 0)) {
            _context6.next = 17;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            message: "No authors found!"
          }));

        case 17:
          filteredUsers = uniqueUsers.filter(function (user) {
            return user._id.toString() !== _currentUser._id.toString();
          }).map(function (user) {
            var selectedTopics = user.selected_topics.map(function (topic) {
              return topic.topic;
            });

            var isFollowing = _currentUser.following.some(function (following) {
              return following._id.toString() === user._id.toString();
            });

            return _objectSpread({}, user.toObject(), {
              selected_topics: selectedTopics,
              isfollowing: isFollowing
            });
          });
          res.status(200).json(filteredUsers);
          _context6.next = 25;
          break;

        case 21:
          _context6.prev = 21;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          res.status(500).json({
            success: false,
            message: "Server error"
          });

        case 25:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 21]]);
});
var getAllUsers = asyncHandler(function _callee7(req, res) {
  var users;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(User.find({}).populate("username").select("username name email"));

        case 3:
          users = _context7.sent;

          if (!users) {
            res.status(404).json({
              message: "No users found with the selected topics"
            });
          }

          res.status(200).json({
            message: "".concat(users.length, " users fetched successfully"),
            users: users
          });
          _context7.next = 12;
          break;

        case 8:
          _context7.prev = 8;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          res.status(500).json({
            success: false,
            message: "Server error"
          });

        case 12:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
module.exports = {
  registerUser: registerUser,
  loginUser: loginUser,
  currentUser: currentUser,
  followUser: followUser,
  unfollowUser: unfollowUser,
  searchUsers: searchUsers,
  getAllUsers: getAllUsers
};