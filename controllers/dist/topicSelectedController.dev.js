"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var asyncHandler = require("express-async-handler");

var User = require("../models/userModel");

var chooseTopics = asyncHandler(function _callee(request, response) {
  var topics, userId, user, newTopics, defaultTopics, selectedTopics, topicsToAdd;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          topics = request.body.topics;
          userId = request.user.id;
          _context.next = 4;
          return regeneratorRuntime.awrap(User.findById(userId));

        case 4:
          user = _context.sent;

          if (user) {
            _context.next = 8;
            break;
          }

          response.status(400);
          throw new Error("User not found");

        case 8:
          newTopics = topics.filter(function (topic) {
            return !user.tabbartopics.some(function (selectedTopic) {
              return selectedTopic._id.toString() === topic._id.toString();
            });
          });
          defaultTopics = [{
            _id: "646209a1640608eec5778452",
            topic: "Latest",
            color: "black",
            icon: "update"
          }, {
            _id: "646209a1640608eec5778453",
            topic: "All",
            color: "black",
            icon: "file-document-outline"
          }, {
            _id: "646209a1640608eec5778454",
            topic: "Featured",
            color: "#3c873a",
            icon: "star-face"
          }];
          selectedTopics = [].concat(_toConsumableArray(user.selected_topics), _toConsumableArray(newTopics.map(function (topic) {
            return {
              _id: topic._id,
              topic: topic.topic,
              value: topic.value,
              icon: topic.icon,
              color: topic.color
            };
          })));
          topicsToAdd = [].concat(_toConsumableArray(defaultTopics.filter(function (defaultTopic) {
            return !user.tabbartopics.some(function (selectedTopic) {
              return selectedTopic._id.toString() === defaultTopic._id;
            });
          })), _toConsumableArray(newTopics.map(function (topic) {
            return {
              _id: topic._id,
              topic: topic.topic,
              color: topic.color,
              icon: topic.icon
            };
          })));
          user.tabbartopics = [].concat(_toConsumableArray(user.tabbartopics), _toConsumableArray(topicsToAdd));
          user.selected_topics = selectedTopics;
          _context.next = 16;
          return regeneratorRuntime.awrap(user.save());

        case 16:
          response.status(200).json({
            success: true,
            message: "Selected topics added successfully"
          });

        case 17:
        case "end":
          return _context.stop();
      }
    }
  });
});
var updateSelectedTopics = asyncHandler(function _callee2(request, response) {
  var topics, userId, user;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          topics = request.body.topics;
          userId = request.user.id;
          _context2.next = 4;
          return regeneratorRuntime.awrap(User.findById(userId));

        case 4:
          user = _context2.sent;

          if (user) {
            _context2.next = 8;
            break;
          }

          response.status(404);
          throw new Error("User not found");

        case 8:
          topics.forEach(function (newTopic) {
            var existingTopicIndex = user.selected_topics.findIndex(function (t) {
              return t._id.toString() === newTopic._id.toString();
            });

            if (existingTopicIndex > -1) {
              user.selected_topics[existingTopicIndex].topic = newTopic.topic;
            } else {
              user.selected_topics.push({
                _id: newTopic._id,
                topic: newTopic.topic,
                value: newTopic.value,
                icon: newTopic.icon,
                color: newTopic.color
              });
            }
          });
          _context2.next = 11;
          return regeneratorRuntime.awrap(user.save());

        case 11:
          response.status(200).json({
            success: true,
            message: "Selected topics added successfully"
          });

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  });
});
var getUsersBySelectedTopics = asyncHandler(function _callee3(request, response) {
  var currentUser, users, filteredUsers;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(User.findById(request.user.id).populate("selected_topics"));

        case 2:
          currentUser = _context3.sent;
          _context3.next = 5;
          return regeneratorRuntime.awrap(User.find({
            selected_topics: {
              $in: currentUser.selected_topics
            }
          }).populate("username").select("profileimage name "));

        case 5:
          users = _context3.sent;

          if (!users) {
            response.status(404).json({
              message: "No users found with the selected topics"
            });
          }

          filteredUsers = users.filter(function (user) {
            return user._id.toString() !== currentUser._id.toString();
          }).map(function (user) {
            var isFollowing = currentUser.following.some(function (following) {
              return following._id.toString() === user._id.toString();
            });
            return _objectSpread({}, user.toObject(), {
              isfollowing: isFollowing
            });
          });
          response.status(200).json(filteredUsers);

        case 9:
        case "end":
          return _context3.stop();
      }
    }
  });
});
var getSelectedTopics = asyncHandler(function _callee4(request, response) {
  var user, selectedTopics;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(User.findById(request.user.id));

        case 2:
          user = _context4.sent;

          if (user) {
            _context4.next = 6;
            break;
          }

          response.status(404);
          throw new Error("User not found");

        case 6:
          selectedTopics = user.selected_topics.map(function (topic) {
            return {
              id: topic.id,
              topic: topic.topic,
              icon: topic.icon,
              color: topic.color
            };
          });
          response.status(200).json(selectedTopics);

        case 8:
        case "end":
          return _context4.stop();
      }
    }
  });
});
var getTabBarTopics = asyncHandler(function _callee5(request, response) {
  var user, tabbartopics;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(User.findById(request.user.id));

        case 2:
          user = _context5.sent;

          if (user) {
            _context5.next = 6;
            break;
          }

          response.status(404);
          throw new Error("User not found");

        case 6:
          tabbartopics = user.tabbartopics.map(function (topic) {
            return {
              id: topic.id,
              topic: topic.topic,
              icon: topic.icon,
              color: topic.color
            };
          });
          response.status(200).json(tabbartopics);

        case 8:
        case "end":
          return _context5.stop();
      }
    }
  });
});
module.exports = {
  chooseTopics: chooseTopics,
  updateSelectedTopics: updateSelectedTopics,
  getUsersBySelectedTopics: getUsersBySelectedTopics,
  getSelectedTopics: getSelectedTopics,
  getTabBarTopics: getTabBarTopics
};