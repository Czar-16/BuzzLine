import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    isOnline: Boolean,
    lastActive: Date,
  },
  {
    strict: false,
  },
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
