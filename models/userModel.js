const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add the name"],
    },
    username: {
      type: String,
      required: [true, "Please add the user name"],
      // unique: [true, "Username already taken"],
    },
    email: {
      type: String,
      required: [true, "Please add the  user email address"],
      unique: [true, "Email address already taken"],
    },
    token: {
      type: String,
    },
    alter_email: {
      type: String,
      unique: [true, "Email address already taken"],
      sparse: true, // Add this line to allow multiple null values
    },
    bio: {
      type: String,
      default: function () {
        return `Hi, I'm ${this.name}! I'm a web developer with in-depth experience in UI/UX design.`;
      },
    },
    profileimage: {
      type: String,
      default:
        "https://firebasestorage.googleapis.com/v0/b/myapp-cbe31.appspot.com/o/Avatar2.png?alt=media&token=0de8f265-809b-4593-a491-651902e7df05",
    },
    tabbartopics: {
      type: [
        {
          _id: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
          topic: String,
          color: String,
          icon: String,
        },
      ],
      default: [],
    },
    profile_tagline: {
      type: String,
    },
    user_location: {
      type: String,
    },
    user_twitter: {
      type: String,
    },
    user_linkedin: {
      type: String,
    },
    user_github: {
      type: String,
    },
    user_stack: {
      type: String,
    },
    user_website: {
      type: String,
    },
    user_skills: {
      type: String,
    },
    selected_topics: {
      type: [
        {
          _id: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
          topic: String,
          color: String,
          icon: String,
        },
      ],
      default: [],
    },
    posts: {
      type: [
        {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Article",
          },
        },
      ],
      default: [],
    },
    followers: {
      type: [
        {
          _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          username: String,
          isfollowing: Boolean,
        },
      ],
      default: [],
    },
    following: {
      type: [
        {
          _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          username: String,
          isfollowing: Boolean,
        },
      ],
      default: [],
    },
    bookmarks: {
      type: [
        {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Article",
          },
          isbookmarked: Boolean,
        },
      ],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    createdMonthYear: {
      type: String,
      default: function () {
        return this.createdAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
