const Reaction = require("../models/Reaction");

exports.createReaction = async (req, res) => {
  try {
    const { postId, reactionType } = req.body;
    const reaction = new Reaction({ postId, reactionType });
    await reaction.save();
    res.status(201).json(reaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
