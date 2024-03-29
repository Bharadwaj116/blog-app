const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
// const regex = new RegExp(`^${searchTerm}`, 'i');

const registerUser = asyncHandler(async (request, response) => {
  try {
    const { name, email } = request.body;
    if (!name || !email) {
      return response.status(404).json({
        message: "All fields are mandatory!",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return response.status(200).json({
        message: "User with the same email already exists!",
      });
    }

    let username = `@${name.toLowerCase().replace(/\s/g, "")}`;
    let count = 1;

    while (true) {
      const existinguser = await User.findOne({ username });
      if (!existinguser) {
        break;
      }

      count++;
      username = `@${name.toLowerCase().replace(/\s/g, "")}${count
        .toString()
        .padStart(2, "0")}`;
    }

    const user = new User({
      name,
      username,
      email,
    });

    console.log(user);
    await user.save();

    return response.status(200).json({
      message: "Registered Successfully!",
    });
  } catch (error) {
    console.error(error);
    return response
      .status(500)
      .json({ success: false, message: "Server error" });
  }
});

const loginUser = asyncHandler(async (request, response) => {
  const { email } = request.body;
  if (!email) {
    return response.status(400).json({ message: "All fields are mandatory!" });
  }

  let user;
  user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const accessToken = jwt.sign(
    {
      user: {
        name: user.name,
        email: user.email,
        id: user.id,
      },
    },
    process.env.CLIENT_SECRET,
    { expiresIn: "10080m" }
  );
  user.token = accessToken;
  await user.save();
  return response.status(200).json({
    accessToken,
    message: "Login Successful!",
  });
});

const currentUser = asyncHandler(async (request, response) => {
  response.json(request.user);
});

const followUser = asyncHandler(async (request, response) => {
  const { userId } = request.body;
  const followerId = request.user.id;
  const followerUsername = request.user.username;

  const user = await User.findById(userId);
  const follower = {
    _id: followerId,
    username: followerUsername,
    isfollowing: true,
  };

  if (!user) {
    response.status(404);
    throw new Error("User not found");
  }

  user.followers.push(follower);
  console.log("follower", follower);

  const currentUser = await User.findById(followerId);
  const isAlreadyFollowing = currentUser.following.some(
    (following) => following._id.toString() === userId.toString()
  );

  if (!isAlreadyFollowing) {
    currentUser.following.push({
      _id: userId,
      username: user.username,
      isfollowing: true,
    });
    await currentUser.save();
  }

  await user.save();

  response.status(200).json({
    isfollowing: true,
    message: `You have followed ${user.username}`,
  });
});

const unfollowUser = asyncHandler(async (request, response) => {
  const { userId } = request.body;
  const followerId = request.user.id;

  const user = await User.findById(userId);
  const follower = await User.findById(followerId);

  if (!user) {
    response.status(404);
    throw new Error("User not found");
  }

  if (!follower) {
    response.status(404);
    throw new Error("follower not found");
  }

  user.followers.some((sub) => sub._id.toString() === followerId.toString());
  {
    user.followers = user.followers.filter(
      (sub) => sub._id.toString() !== followerId.toString()
    );
    await user.save();
  }

  follower.following.some(
    (follow) => follow._id.toString() === userId.toString()
  );
  {
    follower.following = follower.following.filter(
      (follow) => follow._id.toString() !== userId.toString()
    );
    await follower.save();
  }

  response.status(200).json({
    isfollowing: false,
    message: `You have followed ${user.username}`,
  });
});

// const searchUsers = asyncHandler(async (req, res) => {
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

const searchUsers = asyncHandler(async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid Query!",
      });
    }

    const currentUser = await User.findById(req.user.id).populate(
      "selected_topics"
    );

    // Segment 1: Search by username
    const usersByUsername = await User.find({
      username: { $regex: query, $options: "i" },
    })
      .select("profileimage username name selected_topics")
      .exec();

    // Segment 2: Search by name
    const usersByName = await User.find({
      name: { $regex: query, $options: "i" },
    })
      .select("profileimage username name selected_topics")
      .exec();

    const mergedUsers = [...usersByUsername, ...usersByName];

    // Remove duplicates
    const uniqueUsers = mergedUsers.filter(
      (user, index, self) =>
        index ===
        self.findIndex((u) => u._id.toString() === user._id.toString())
    );

    if (uniqueUsers.length === 0) {
      return res.status(404).json({
        message: "No authors found!",
      });
    }

    const filteredUsers = uniqueUsers
      .filter((user) => user._id.toString() !== currentUser._id.toString())
      .map((user) => {
        const selectedTopics = user.selected_topics.map((topic) => topic.topic);
        const isFollowing = currentUser.following.some(
          (following) => following._id.toString() === user._id.toString()
        );
        return {
          ...user.toObject(),
          selected_topics: selectedTopics,
          isfollowing: isFollowing,
        };
      });

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({})
      .populate("username")
      .select("username name email");

    if (!users) {
      res.status(404).json({
        message: "No users found with the selected topics",
      });
    }
    res.status(200).json({
      message: `${users.length} users fetched successfully`,
      users: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  followUser,
  unfollowUser,
  searchUsers,
  getAllUsers,
};
