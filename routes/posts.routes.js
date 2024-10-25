const router = require("express").Router();
const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model");
const path = require("path");
const { isAuthenticated } = require("../middlewares/route-guard.middleware");

// Create post with media
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    console.log("body", req.body);
    const newPost = await Post.create({
      content: req.body.content,
      author: req.tokenPayload.userId,
    });

    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
});

// Get all posts
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("author", "username")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
});

// Get a specific post
router.get("/:postId", isAuthenticated, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId).populate(
      "author",
      "username"
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});

// Update any post
router.put("/:postId", isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.tokenPayload;
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not the author of this post" });
    }
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      { content: req.body.content },
      { new: true }
    ).populate("author", "username");
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
});

// Delete a post
router.delete("/:postId", isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.tokenPayload;
    const deletedPost = await Post.findOneAndDelete({
      _id: req.params.postId,
      author: userId,
    });
    if (!deletedPost) {
      return res
        .status(404)
        .json({ message: "Post not found or you are not the author" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
});

// Add a comment to a post
router.post("/:postId/comments", isAuthenticated, async (req, res, next) => {
  try {
    const newComment = await Comment.create({
      content: req.body.content,
      author: req.tokenPayload.userId,
      post: req.params.postId,
    });
    await Post.findByIdAndUpdate(req.params.postId, {
      $push: { comments: newComment._id },
    });
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
});

// Get comments for a post
router.get("/:postId/comments", isAuthenticated, async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate(
      "author",
      "username email"
    );
    res.json(comments);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
