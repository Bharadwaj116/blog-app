const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
// const regex = new RegExp(`^${searchTerm}`, 'i');

const registerUser = asyncHandler(async (request, response) => {
  try{
  const { name, username, email, password } = request.body;
  if (!username || !email || !password) {
    return response.status(404).json({
      message: "All fields are mandatory!",
    });
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    return response.status(404).json({
      message: "User already registered!",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password: ", hashedPassword);
  const user = new User({
    name,
    username,
    email,
    password: hashedPassword,
  });

  console.log(user);
  if (user) {
    await user.save();
    response.status(200).json({
      message: "Registered Successfully!"
    });
  } else {
    return response.status(404).json({
      message: "User data is not valid",
    });
  }
  response.status(200).json({ message: "Register the user" });
}catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


const loginUser = asyncHandler(async (request, response) => {
  const { email, password } = request.body;
  if (!email || !password) {
    response.status(400);
    throw new Error("All fields are mandatory!");
  }

  let user;
  if (/^@/.test(email)) {
    user = await User.findOne({ username: email });
  } else if (email != /^@/.test(email)) {
    user = await User.findOne({ email });
  } else {
    response.status(401);
    throw new Error("Invalid username or password");
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          name: user.name,
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "10080m" }
    );
    response.status(200).json({
      accessToken,
      message: "Login Successfully!",
    });
  } else {
    response.status(401);
    throw new Error("Invalid email or password");
  }
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
  console.log("follower",follower)

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
    message:`You have followed ${user.username}` ,
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
        index === self.findIndex((u) => u._id.toString() === user._id.toString())
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
