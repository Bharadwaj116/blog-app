const asyncHandler = require("express-async-handler");
const Article = require("../models/articleModel");
const User = require("../models/userModel");
const Topic = require("../models/topicMainModel");

const getArticles = asyncHandler(async (request, response) => {
  const article = await Article.find({});
  response.status(200).json(article);
});

const createArticle = asyncHandler(async (request, response) => {
  console.log("The request body is :", request.body);
  const {
    article_title,
    article_desc,
    article_topic,
    article_sub,
    article_image,
  } = request.body;
  if (!article_topic || !article_title || !article_desc) {
    response.status(400);
    throw new Error("All fields are mandatory !");
  }

  const user = await User.findById(request.user.id);

  const topic = await Topic.findOne({ topic: article_topic[1] });

  const article = new Article({
    user_id: request.user.id,
    user_name: user.name,
    user_image: user.profileimage,
    article_title,
    article_desc,
    article_topic: article_topic[1],
    article_sub,
    article_image,
  });
  console.log(article);

  const post = {
    _id: article._id,
  };
  user.posts.push(post);

  console.log(post);

  if (!user.selected_topics.find((t) => t._id.equals(topic._id))) {
    user.selected_topics.push({
      _id: topic._id,
      topic: topic.topic,
      color: topic.color,
      icon: topic.icon,
    });
  }

  await Promise.all([user.save(), article.save()]);

  response
    .status(200)
    .json({ status: true, message: "Article created successfully!" });
});

const GetArticle = asyncHandler(async (req, res) => {
  try {
    const { articleId } = req.body;
    const currentUser = await User.findById(req.user.id);
    const article = await Article.findById(articleId)
      .select(
        "article_title article_sub article_image article_desc article_topic user_name user_image createdAt user_id article_clap clappedBy"
      )
      .populate("user_id", ["profileimage", "name"]);

    const articleUser = await User.findById(article.user_id._id);

    const isfollowing = articleUser.followers.some(
      (follower) => follower._id.toString() === currentUser._id.toString()
    );

    const isbookmarked = currentUser.bookmarks.find(
      (bookmark) => bookmark._id.toString() === article._id.toString()
    );

    const clappedByCurrentUser = article.clappedBy.find(
      (clapper) => clapper._id.toString() === currentUser.id.toString()
    );
    const isclapped = clappedByCurrentUser
      ? clappedByCurrentUser.isclapped
      : false;

    const user_image = articleUser.profileimage;
    const user_name = articleUser.name;
    const currentuser =
      articleUser._id.toString() === currentUser.id.toString();

    const articleWithDetails = {
      ...article.toObject(),
      isfollowing,
      isbookmarked: isbookmarked ? isbookmarked.isbookmarked : false,
      currentuser,
      isclapped,
      user_image,
      user_name,
    };

    res.status(200).json(articleWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const UpdateArticle = asyncHandler(async (req, res) => {
  try {
    const { articleId } = req.body;
    const updates = req.body;
    const article = await Article.findById(articleId);
    if (!article) {
      res.status(404);
      throw new Error("Article not found");
    }

    const updatedArticle = await Article.findByIdAndUpdate(articleId, updates, {
      new: true,
      runValidators: true,
    });
    res.json(updatedArticle);

    if (!updatedArticle) {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

const DeleteArticle = asyncHandler(async (request, response) => {
  console.log("The request body:", request.body);
  const { user_id } = request.body;
  if (!user_id) {
    response.status(400);
    throw new Error("Article Id are Mandatory!");
  }
  response
    .status(200)
    .json({ message: `Deleted Article for ${request.params.id}` });
});

const getLatestArticleCards = asyncHandler(async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    // console.log("currentuser",currentUser)
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const articles = await Article.find({ createdAt: { $gte: oneDayAgo } })
      .select(
        "article_title article_sub article_image article_desc article_topic user_name user_image createdAt user_id article_clap clappedBy"
      )
      .populate("user_id", ["profileimage", "name"])
      .sort({ createdAt: -1 });

    for (let i = 0; i < articles.length; i++) {
      const authorId = articles[i]?.user_id?._id;
      const author = await User.findById(authorId);
      const user_image = author?.profileimage;
      const user_name = author?.name;
      const isfollowing = author?.followers.some(
        (follower) => follower._id.toString() === currentUser._id.toString()
      );
      const isbookmarked = currentUser?.bookmarks.find(
        (bookmark) => bookmark._id.toString() === articles[i]._id.toString()
      );

      const currentuser = authorId?.toString() === currentUser?._id?.toString();

      const clappedByCurrentUser = articles[i].clappedBy.find(
        (clapper) => clapper._id.toString() === currentUser._id.toString()
      );
      const isclapped = clappedByCurrentUser
        ? clappedByCurrentUser.isclapped
        : false;

      articles[i] = {
        ...articles[i].toObject(),
        isfollowing,
        isbookmarked: isbookmarked ? isbookmarked.isbookmarked : false,
        currentuser,
        isclapped,
        user_image,
        user_name,
      };
    }

    res.status(200).json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const clapArticle = asyncHandler(async (req, res) => {
  const { articleId } = req.body;

  const article = await Article.findById(articleId);
  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const isAlreadyClapped = article.clappedBy.find(
    (clapped) => clapped._id.toString() === user._id.toString()
  );

  if (isAlreadyClapped) {
    return res.status(400).json({
      error: "Article already clapped",
    });
  }
  if (!isAlreadyClapped) {
    article.clappedBy.push({ _id: user._id, isclapped: true });
    article.article_clap++;
  } else {
    article.article_clap--;
  }

  await article.save();

  res
    .status(200)
    .json({ isclapped: true, message: "Article clapped successfully" });
});

const unClapArticle = asyncHandler(async (request, response) => {
  const { articleId } = request.body;
  const userId = request.user.id;

  const user = await User.findById(userId);

  const article = await Article.findById(articleId);
  if (!article) {
    return response.status(404).json({ error: "Article not found" });
  }

  if (!user) {
    return response.status(404).json({ error: "User not found" });
  }

  const clapperIndex = article.clappedBy.findIndex(
    (clapper) => clapper._id.toString() === user._id.toString()
  );
  if (clapperIndex === -1) {
    return response
      .status(400)
      .json({ error: "User has not clapped this article" });
  }

  const isClapped = article.clappedBy[clapperIndex].isclapped;
  article.clappedBy.splice(clapperIndex, 1);
  if (isClapped) {
    article.article_clap--;
  }
  await article.save();

  response
    .status(200)
    .json({ isclapped: false, message: "Article unclapped successfully" });
});

const updateArticleViews = asyncHandler(async (req, res) => {
  try {
    const { article_id, user_id } = req.body;

    const article = await Article.findById(article_id);
    if (article.article_views.includes(user_id)) {
      return res.status(400).json({ error: "Article already viewed" });
    }

    article.article_views.push(user_id);
    article.save();

    res.status(200).json({ message: "Article views updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// const SearchArticles = asyncHandler(async (req, res) => {
//   try {
//     const { query } = req.body;

//     if (!query || !query.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid Query!",
//       });
//     }

//     const currentUser = await User.findById(req.user.id);

//     const articles = await Article.find({
//       $or: [
//         { article_title: { $regex: query, $options: "i" } },
//         { article_sub: { $regex: query, $options: "i" } },
//         { article_topic: { $regex: query, $options: "i" } },
//         { user_name: { $regex: query, $options: "i" } },
//         { "author.username": { $regex: query, $options: "i" } },
//       ],
//     })
//       .select(
//         "article_title article_sub article_image article_desc article_topic user_name user_image createdAt user_id article_clap clappedBy"
//       )
//       .sort({ createdAt: -1 })
//       .populate("user_id", ["profileimage", "name"])
//       .exec();
//     if (articles.length === 0) {
//       return res.status(404).json({
//         message: "No articles found!",
//       });
//     }

//     for (let i = 0; i < articles.length; i++) {
//       const authorId = articles[i].user_id._id;
//       const author = await User.findById(authorId);
//       const user_image = author.profileimage;
//       const user_name = author.name;
//       // const isfollowing = author.followers.some(
//       //   (follower) => follower._id.toString() === currentUser._id.toString()
//       // );
//       const isfollowing = currentUser.following.some(
//         (following) => following._id.toString() === authorId.toString()
//       );
//       const currentuser = authorId.toString() === req.user.id.toString();

//       const clappedByCurrentUser = articles[i].clappedBy.find(
//         (clapper) => clapper._id.toString() === currentUser._id.toString()
//       );
//       const isclapped = clappedByCurrentUser
//         ? clappedByCurrentUser.isclapped
//         : false;

//       articles[i] = {
//         ...articles[i].toObject(),
//         isfollowing,
//         currentuser,
//         isclapped,
//         user_image,
//         user_name,
//       };
//     }

//     res.status(200).json(articles);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

const SearchArticles = asyncHandler(async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid Query!",
      });
    }

    const currentUser = await User.findById(req.user.id);

    // Segment 1: Search by article fields
    const articlesByFields = await Article.find({
      $or: [
        { article_title: { $regex: query, $options: "i" } },
        { article_sub: { $regex: query, $options: "i" } },
        { article_topic: { $regex: query, $options: "i" } },
      ],
    })
      .select(
        "article_title article_sub article_image article_desc article_topic user_name user_image createdAt user_id article_clap clappedBy"
      )
      .sort({ createdAt: -1 })
      .populate("user_id", ["profileimage", "name"])
      .exec();

    // Segment 2: Search by author fields
    const articlesByAuthor = await Article.find({
      $or: [
        { user_name: { $regex: query, $options: "i" } },
        { "author.username": { $regex: query, $options: "i" } },
      ],
    })
      .select(
        "article_title article_sub article_image article_desc article_topic user_name user_image createdAt user_id article_clap clappedBy"
      )
      .sort({ createdAt: -1 })
      .populate("user_id", ["profileimage", "name"])
      .exec();

    const mergedArticles = [...articlesByFields, ...articlesByAuthor];

    // Remove duplicates
    const uniqueArticles = mergedArticles.filter(
      (article, index, self) =>
        index ===
        self.findIndex((a) => a._id.toString() === article._id.toString())
    );

    if (uniqueArticles.length === 0) {
      return res.status(404).json({
        message: "No articles found!",
      });
    }

    for (let i = 0; i < uniqueArticles.length; i++) {
      const authorId = uniqueArticles[i]?.user_id?._id;
      const author = await User.findById(authorId);
      const user_image = author?.profileimage;
      const user_name = author?.name;
      const isfollowing = currentUser.following.some(
        (following) => following?._id?.toString() === authorId?.toString()
      );
      const currentuser = authorId?.toString() === req.user.id?.toString();

      const clappedByCurrentUser = uniqueArticles[i].clappedBy.find(
        (clapper) => clapper?._id?.toString() === currentUser?._id?.toString()
      );
      const isclapped = clappedByCurrentUser
        ? clappedByCurrentUser.isclapped
        : false;

      uniqueArticles[i] = {
        ...uniqueArticles[i].toObject(),
        isfollowing,
        currentuser,
        isclapped,
        user_image,
        user_name,
      };
    }

    res.status(200).json(uniqueArticles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

const BookmarkArticle = asyncHandler(async (req, res) => {
  const { ArticleId } = req.body;
  const currentUser = await User.findById(req.user.id);

  if (!currentUser) {
    return res.status(404).json({ error: "User not found" });
  }

  const article = await Article.findById(ArticleId);

  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }

  const isAlreadyBookmarked = currentUser.bookmarks.find(
    (bookmark) => bookmark._id.toString() === ArticleId.toString()
  );

  if (isAlreadyBookmarked) {
    return res.status(400).json({
      error: "Article already bookmarked",
    });
  }

  currentUser.bookmarks.push({ _id: ArticleId, isbookmarked: true });
  await currentUser.save();

  return res.status(200).json({
    isbookemarked: true,
    message: "Article bookmarked successfully",
  });
});

const UnBookmarkArticle = asyncHandler(async (req, res) => {
  const { ArticleId } = req.body;
  const currentUser = await User.findById(req.user.id);

  if (!currentUser) {
    return res.status(404).json({ error: "User not found" });
  }

  const articleIndex = currentUser.bookmarks.findIndex(
    (bookmark) => bookmark._id.toString() === ArticleId.toString()
  );

  if (articleIndex === -1) {
    return res.status(400).json({
      error: "Article not found in bookmarks",
    });
  }

  currentUser.bookmarks.splice(articleIndex, 1);
  await currentUser.save();

  return res.status(200).json({
    isbookmarked: false,
    message: "Article removed from bookmarks",
  });
});

const GetUserBookmarks = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user.id);
  if (!currentUser) {
    return res.status(404).json({ error: "User not found" });
  }

  const bookmarkedArticleIds = currentUser.bookmarks
    .filter((bookmark) => bookmark.isbookmarked)
    .map((bookmark) => bookmark._id);

  const articles = await Article.find({
    _id: { $in: bookmarkedArticleIds },
  })
    .select(
      "article_title article_sub article_image article_desc article_topic createdAt user_id article_clap clappedBy"
    )
    .populate("user_id", ["profileimage", "name"])
    .sort({ createdAt: -1 })
    .exec();

  for (let i = 0; i < articles.length; i++) {
    const authorId = articles[i]?.user_id?._id;
    const author = await User.findById(authorId);
    const user_image = author.profileimage;
    const user_name = author.name;
    const isfollowing = author?.followers?.some(
      (follower) => follower._id.toString() === currentUser._id.toString()
    );
    const isbookmarked = currentUser?.bookmarks?.find(
      (bookmark) => bookmark?._id.toString() === articles[i]?._id?.toString()
    );

    const currentuser = authorId?.toString() === req.user.id?.toString();

    const clappedByCurrentUser = articles[i].clappedBy.find(
      (clapper) => clapper._id.toString() === currentUser._id.toString()
    );
    const isclapped = clappedByCurrentUser
      ? clappedByCurrentUser.isclapped
      : false;

    articles[i] = {
      ...articles[i].toObject(),
      isfollowing,
      isbookmarked: isbookmarked ? isbookmarked.isbookmarked : false,
      currentuser,
      isclapped,
      user_image,
      user_name,
    };
  }

  return res.status(200).json(articles);
});

// const SearchBookMarkedArticles = asyncHandler(async (req, res) => {
//   try {
//     const { query } = req.body;

//     if (!query || !query.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid Query!",
//       });
//     }

//     const currentUser = await User.findById(req.user.id).populate("bookmarks");

//     const bookmarks = currentUser.bookmarks.filter(
//       (bookmark) => bookmark.isbookmarked
//     );

//     const articleIds = bookmarks.map((bookmark) => bookmark._id);

//     const articles = await Article.find({
//       _id: { $in: articleIds },
//       $or: [
//         { article_topic: { $regex: query, $options: "i" } },
//         { article_title: { $regex: query, $options: "i" } },
//         { user_name: { $regex: query, $options: "i" } },
//       ],
//     })
//       .select(
//         "article_title article_sub article_image article_desc article_topic user_name user_image createdAt user_id article_clap clappedBy"
//       )
//       .sort({ createdAt: -1 })
//       .exec();
//     if (articles.length === 0) {
//       return res.status(404).json({
//         message: "No authors found!",
//       });
//     }

//     for (let i = 0; i < articles.length; i++) {
//       const authorId = articles[i].user_id;
//       const author = await User.findById(authorId);
//       // const isfollowing = author.followers.some(
//       //   (follower) => follower._id.toString() === currentUser._id.toString()
//       // );
//       const isfollowing = currentUser.following.some(
//         (following) => following._id.toString() === authorId.toString()
//       );
//       const isbookmarked = currentUser.bookmarks.find(
//         (bookmark) => bookmark._id.toString() === articles[i]._id.toString()
//       );
//       const currentuser = authorId.toString() === req.user.id.toString();

//       const clappedByCurrentUser = articles[i].clappedBy.find(
//         (clapper) => clapper._id.toString() === currentUser._id.toString()
//       );
//       const isclapped = clappedByCurrentUser
//         ? clappedByCurrentUser.isclapped
//         : false;

//       articles[i] = {
//         ...articles[i].toObject(),
//         isfollowing,
//         isbookmarked: isbookmarked ? isbookmarked.isbookmarked : false,
//         currentuser,
//         isclapped,
//       };
//     }

//     res.status(200).json(articles);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Server Error!",
//     });
//   }
// });

const SearchBookMarkedArticles = asyncHandler(async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid Query!",
      });
    }

    const currentUser = await User.findById(req.user.id).populate("bookmarks");

    const bookmarks = currentUser.bookmarks.filter(
      (bookmark) => bookmark.isbookmarked
    );

    const articleIds = bookmarks.map((bookmark) => bookmark._id);

    // Segment 1: Search by article fields
    const articlesByFields = await Article.find({
      _id: { $in: articleIds },
      $or: [
        { article_topic: { $regex: query, $options: "i" } },
        { article_title: { $regex: query, $options: "i" } },
      ],
    })
      .select(
        "article_title article_sub article_image article_desc article_topic user_name user_image createdAt user_id article_clap clappedBy"
      )
      .sort({ createdAt: -1 })
      .exec();

    // Segment 2: Search by author fields
    const articlesByAuthor = await Article.find({
      _id: { $in: articleIds },
      user_name: { $regex: query, $options: "i" },
    })
      .select(
        "article_title article_sub article_image article_desc article_topic user_name user_image createdAt user_id article_clap clappedBy"
      )
      .sort({ createdAt: -1 })
      .exec();

    const mergedArticles = [...articlesByFields, ...articlesByAuthor];

    // Remove duplicates
    const uniqueArticles = mergedArticles.filter(
      (article, index, self) =>
        index ===
        self.findIndex((a) => a._id.toString() === article._id.toString())
    );

    if (uniqueArticles.length === 0) {
      return res.status(404).json({
        message: "No authors found!",
      });
    }

    for (let i = 0; i < uniqueArticles.length; i++) {
      const authorId = uniqueArticles[i]?.user_id;
      const author = await User.findById(authorId);
      const isfollowing = currentUser?.following.some(
        (following) => following?._id?.toString() === authorId?.toString()
      );
      const isbookmarked = currentUser?.bookmarks.find(
        (bookmark) =>
          bookmark._id?.toString() === uniqueArticles[i]?._id.toString()
      );
      const currentuser = authorId?.toString() === req.user.id?.toString();

      const clappedByCurrentUser = uniqueArticles[i]?.clappedBy?.find(
        (clapper) => clapper?._id?.toString() === currentUser?._id?.toString()
      );
      const isclapped = clappedByCurrentUser
        ? clappedByCurrentUser.isclapped
        : false;

      uniqueArticles[i] = {
        ...uniqueArticles[i].toObject(),
        isfollowing,
        isbookmarked: isbookmarked ? isbookmarked.isbookmarked : false,
        currentuser,
        isclapped,
      };
    }

    res.status(200).json(uniqueArticles);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error!",
    });
  }
});

const FilterArticles = asyncHandler(async (req, res) => {
  try {
    const { article_topic } = req.body;
    const currentUser = await User.findById(req.user.id);
    const articles = await Article.find({ article_topic })
      .select(
        "article_title article_sub article_image article_desc article_topic createdAt user_id article_clap clappedBy"
      )
      .populate("user_id", ["profileimage", "name"])
      .sort({ createdAt: -1 })
      .exec();

    for (let i = 0; i < articles.length; i++) {
      const authorId = articles[i].user_id._id;
      const author = await User.findById(authorId);
      const user_image = author.profileimage;
      const user_name = author.name;
      const isfollowing = author.followers.some(
        (follower) => follower._id.toString() === currentUser._id.toString()
      );
      const isbookmarked = currentUser.bookmarks.find(
        (bookmark) => bookmark._id.toString() === articles[i]._id.toString()
      );

      const currentuser = authorId.toString() === req.user.id.toString();

      const clappedByCurrentUser = articles[i].clappedBy.find(
        (clapper) => clapper._id.toString() === currentUser._id.toString()
      );
      const isclapped = clappedByCurrentUser
        ? clappedByCurrentUser.isclapped
        : false;

      articles[i] = {
        ...articles[i].toObject(),
        isfollowing,
        isbookmarked: isbookmarked ? isbookmarked.isbookmarked : false,
        currentuser,
        isclapped,
        user_image,
        user_name,
      };
    }

    res.status(200).json(articles);
  } catch (error) {
    console.error(error);
  }
});

module.exports = {
  createArticle,
  GetArticle,
  getArticles,
  UpdateArticle,
  DeleteArticle,
  getLatestArticleCards,
  clapArticle,
  unClapArticle,
  updateArticleViews,
  SearchArticles,
  BookmarkArticle,
  UnBookmarkArticle,
  GetUserBookmarks,
  SearchBookMarkedArticles,
  FilterArticles,
};
