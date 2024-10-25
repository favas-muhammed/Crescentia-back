const router = require("express").Router();
const Comment = require("../models/Comment.model");
const Post = require("../models/Post.model");
const { isAuthenticated } = require("../middlewares/route-guard.middleware");

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
      "email"
    );
    res.json(comments);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
