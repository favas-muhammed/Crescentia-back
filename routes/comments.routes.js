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

// Update a comment
router.put(
  "/:postId/comments/:commentId",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const comment = await Comment.findById(req.params.commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      if (comment.author.toString() !== req.tokenPayload.userId) {
        return res
          .status(403)
          .json({ message: "You are not authorized to edit this comment" });
      }
      const updatedComment = await Comment.findByIdAndUpdate(
        req.params.commentId,
        { content: req.body.content },
        { new: true }
      ).populate("author", "email");
      res.json(updatedComment);
    } catch (error) {
      next(error);
    }
  }
);

// Delete a comment
const deleteComment = async (req, res, next) => {
  try {
    const { postId, commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== req.tokenPayload.userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);
    await Post.findByIdAndUpdate(postId, {
      $pull: { comments: commentId },
    });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

router.delete("/:postId/comments/:commentId", isAuthenticated, deleteComment);

module.exports = router;
