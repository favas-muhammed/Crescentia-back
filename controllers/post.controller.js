const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndRemove(req.params.id);
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting post" });
  }
});

module.exports = router;
