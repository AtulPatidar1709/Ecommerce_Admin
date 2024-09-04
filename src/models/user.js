import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "Please provide a unique name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: [true, "Please provide a unique email"],
    },
    image: {
      type: String,
      default: "",
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
