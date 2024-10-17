const { Schema, model, Types } = require("mongoose");

const postSchema = new Schema(
  {
    author: { type: Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    mediaType: { type: String, enum: ["image", "video", "text"] },
    mediaUrl: String,
    likes: [{ type: Types.ObjectId, ref: "User" }],
    comments: [
      {
        author: { type: Types.ObjectId, ref: "User" },
        content: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    isPrivate: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = model("Post", postSchema);
