// User model
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, index: true },
  password: { type: String, required: true },
  refreshToken: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
export { User as default };
