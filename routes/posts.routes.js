const router = require("express").Router();
const Post = require("../models/Post.model");
const { isAuthenticated } = require("../middlewares/route-guard.middleware");

// Create a post
// Continuing from posts.routes.js

// Create a post
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const newPost = await Post.create({
      ...req.body,
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
    const posts = await Post.find().populate("author", "username");
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

// Update a post
router.put("/:postId", isAuthenticated, async (req, res, next) => {
  try {
    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.params.postId, author: req.tokenPayload.userId },
      req.body,
      { new: true }
    );
    if (!updatedPost) {
      return res
        .status(404)
        .json({ message: "Post not found or you are not the author" });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
});

// Delete a post
router.delete("/:postId", isAuthenticated, async (req, res, next) => {
  try {
    const deletedPost = await Post.findOneAndDelete({
      _id: req.params.postId,
      author: req.tokenPayload.userId,
    });
    if (!deletedPost) {
      return res
        .status(404)
        .json({ message: "Post not found or you are not the author" });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
