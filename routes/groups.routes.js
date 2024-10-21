const router = require("express").Router();
const Group = require("../models/Group.model");
const { isAuthenticated } = require("../middlewares/route-guard.middleware");

// Get all groups
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const groups = await Group.find().populate("members", "username");
    res.json(groups);
  } catch (error) {
    next(error);
  }
});

// Create a new group
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const newGroup = await Group.create({
      ...req.body,
      members: [req.tokenPayload.userId],
      admins: [req.tokenPayload.userId],
    });
    res.status(201).json(newGroup);
  } catch (error) {
    next(error);
  }
});

// Join a group
router.post("/:groupId/join", isAuthenticated, async (req, res, next) => {
  try {
    const group = await Group.findByIdAndUpdate(
      req.params.groupId,
      { $addToSet: { members: req.tokenPayload.userId } },
      { new: true }
    );
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    res.json(group);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
