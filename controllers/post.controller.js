exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "username");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
