import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["supplier", "user", "admin"], default: "user" },
    status: { type: Boolean, default: true }, // active or deactivated by admin
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
