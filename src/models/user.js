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
      default: "", // Default to an empty string if no image is provided
    },
    password: {
      type: String,
    },
    googleId: {
      type: String, // Used to store the Google user ID
      unique: true, // Ensure googleId is unique
      sparse: true, // Allow multiple users with null values for googleId
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
