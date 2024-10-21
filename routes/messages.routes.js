const router = require("express").Router();
const Message = require("../models/Message.model");
const { isAuthenticated } = require("../middlewares/route-guard.middleware");

// Get all messages for the current user
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.tokenPayload.userId },
        { receiver: req.tokenPayload.userId },
      ],
    }).populate("sender receiver", "username");
    res.json(messages);
  } catch (error) {
    next(error);
  }
});

// Send a new message
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const newMessage = await Message.create({
      ...req.body,
      sender: req.tokenPayload.userId,
    });
    res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
