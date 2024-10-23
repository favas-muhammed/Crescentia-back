const express = require("express");
const router = express.Router();
const reactionController = require("../controllers/reactionController");

router.post("/", reactionController.createReaction);

module.exports = router;
