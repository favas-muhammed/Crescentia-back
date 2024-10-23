const router = require("express").Router();
const Post = require("../models/Post.model");
const multer = require("multer");
const path = require("path");
const { isAuthenticated } = require("../middlewares/route-guard.middleware");

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const validTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4"];
    if (validTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

// Create post with media
router.post(
  "/",
  isAuthenticated,
  upload.single("media"),
  async (req, res, next) => {
    try {
      const mediaType = req.file
        ? req.file.mimetype.startsWith("image/")
          ? "image"
          : "video"
        : "none";

      const newPost = await Post.create({
        content: req.body.content,
        mediaUrl: req.file ? `/uploads/${req.file.filename}` : null,
        mediaType,
        author: req.tokenPayload.userId,
      });

      res.status(201).json(newPost);
    } catch (error) {
      next(error);
    }
  }
);

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
      req.body,
      { new: true }
    );
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
    res.status(204).json();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
