const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const chooseTopics = asyncHandler(async (request, response) => {
  const { topics } = request.body;
  const userId = request.user.id;

  const user = await User.findById(userId);

  if (!user) {
    response.status(400);
    throw new Error("User not found");
  }

  const newTopics = topics.filter((topic) => {
    return !user.tabbartopics.some(
      (selectedTopic) => selectedTopic._id.toString() === topic._id.toString()
    );
  });

  const defaultTopics = [
    {
      _id: "646209a1640608eec5778452",
      topic: "Latest",
      color: "black",
      icon: "update",
    },
    {
      _id: "646209a1640608eec5778453",
      topic: "All",
      color: "black",
      icon: "file-document-outline",
    },
    {
      _id: "646209a1640608eec5778454",
      topic: "Featured",
      color: "#3c873a",
      icon: "star-face",
    },
  ];

  const selectedTopics = [
    ...user.selected_topics,
    ...newTopics.map((topic) => ({
      _id: topic._id,
      topic: topic.topic,
      value: topic.value,
      icon: topic.icon,
      color: topic.color,
    })),
  ];

  const topicsToAdd = [
    ...defaultTopics.filter((defaultTopic) => {
      return !user.tabbartopics.some(
        (selectedTopic) => selectedTopic._id.toString() === defaultTopic._id
      );
    }),
    ...newTopics.map((topic) => ({
      _id: topic._id,
      topic: topic.topic,
      color: topic.color,
      icon: topic.icon,
    })),
  ];

  user.tabbartopics = [...user.tabbartopics, ...topicsToAdd];

  user.selected_topics = selectedTopics;

  await user.save();

  response.status(200).json({
    success: true,
    message: "Selected topics added successfully",
  });
});

const updateSelectedTopics = asyncHandler(async (request, response) => {
  const { topics } = request.body;
  const userId = request.user.id;

  const user = await User.findById(userId);

  if (!user) {
    response.status(404);
    throw new Error("User not found");
  }

  topics.forEach((newTopic) => {
    const existingTopicIndex = user.selected_topics.findIndex(
      (t) => t._id.toString() === newTopic._id.toString()
    );

    if (existingTopicIndex > -1) {
      user.selected_topics[existingTopicIndex].topic = newTopic.topic;
    } else {
      user.selected_topics.push({
        _id: newTopic._id,
        topic: newTopic.topic,
        value: newTopic.value,
        icon: newTopic.icon,
        color: newTopic.color,
      });
    }
  });

  await user.save();

  response.status(200).json({
    success: true,
    message: "Selected topics added successfully",
  });
});

const getUsersBySelectedTopics = asyncHandler(async (request, response) => {
  const currentUser = await User.findById(request.user.id).populate(
    "selected_topics"
  );

  const users = await User.find({
    selected_topics: { $in: currentUser.selected_topics },
  })
    .populate("username")
    .select("profileimage name ");

  if (!users) {
    response.status(404).json({
      message: "No users found with the selected topics",
    });
  }

  const filteredUsers = users
    .filter((user) => user._id.toString() !== currentUser._id.toString())
    .map((user) => {
      const isFollowing = currentUser.following.some(
        (following) => following._id.toString() === user._id.toString()
      );
      return {
        ...user.toObject(),
        isfollowing: isFollowing,
      };
    });
  response.status(200).json(filteredUsers);
});

const getSelectedTopics = asyncHandler(async (request, response) => {
  const user = await User.findById(request.user.id);
  if (!user) {
    response.status(404);
    throw new Error("User not found");
  }

  const selectedTopics = user.selected_topics.map((topic) => {
    return {
      id: topic.id,
      topic: topic.topic,
      icon: topic.icon,
      color: topic.color,
    };
  });

  response.status(200).json(selectedTopics);
});
const getTabBarTopics = asyncHandler(async (request, response) => {
  const user = await User.findById(request.user.id);
  if (!user) {
    response.status(404);
    throw new Error("User not found");
  }

  const tabbartopics = user.tabbartopics.map((topic) => {
    return {
      id: topic.id,
      topic: topic.topic,
      icon: topic.icon,
      color: topic.color,
    };
  });

  response.status(200).json(tabbartopics);
});

module.exports = {
  chooseTopics,
  updateSelectedTopics,
  getUsersBySelectedTopics,
  getSelectedTopics,
  getTabBarTopics,
};
