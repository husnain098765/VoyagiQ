import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // hashed password
  },
  {
    timestamps: true,
    collection: "users", 
  }
);

export default mongoose.models.AdminUser || mongoose.model("AdminUser", UserSchema);