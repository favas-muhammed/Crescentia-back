const { Schema, model, Types } = require("mongoose");

const groupSchema = new Schema(
  {
    name: { type: String, required: true },
    members: [{ type: Types.ObjectId, ref: "User" }],
    posts: [{ type: Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

module.exports = model("Group", groupSchema);
