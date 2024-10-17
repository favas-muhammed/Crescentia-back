const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return v.endsWith("@thebrandcollector.com");
        },
        message: (props) => `${props.value} is not a valid company email!`,
      },
    },
    passwordHash: { type: String, required: true },
    // additional fields if needed.
  },
  { timestamps: true }
);

const User = model("User", userSchema);

module.exports = User;
