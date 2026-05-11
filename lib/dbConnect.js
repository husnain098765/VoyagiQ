// dbConnect.js

import mongoose from "mongoose";

export async function dbConnect() {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("📌 MongoDB already connected");
      return;
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.log("❌ MongoDB Connection Failed:", error);
  }
}
