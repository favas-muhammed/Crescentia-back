const User = require("../models/User.model");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middlewares/route-guard.middleware");

const router = require("express").Router();

// POST Signup
router.post("/signup", async (req, res, next) => {
  const { username, email, password } = req.body;
  console.log(username, email, password);
  if (!email.endsWith("@thebrandcollector.com")) {
    return res.status(400).json({ message: "Invalid company email" });
  }
  const userToCreate = req.body;

  const salt = bcrypt.genSaltSync(13);

  userToCreate.passwordHash = bcrypt.hashSync(req.body.password, salt);
  try {
    const newUser = await User.create(userToCreate);
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// POST Login
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide both email and password" });
  }

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const authToken = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    res.json({ token: authToken });
  } catch (error) {
    next(error);
  }
});
// Verify
router.get("/verify", isAuthenticated, async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.tokenPayload.userId);
    res.json(currentUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
