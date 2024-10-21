// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");
const withDB = require("./db");
const postsRouter = require("./routes/posts.routes");
const groupsRouter = require("./routes/groups.routes");
const messagesRouter = require("./routes/messages.routes");
const commentsRouter = require("./routes/comments.routes");
const authRouter = require("./routes/auth.routes");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
app.use("/auth", authRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/groups", groupsRouter);
app.use("/api/comments", commentsRouter);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

// Use withDB to connect to the database and start the server

module.exports = app;
