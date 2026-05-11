import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  // Yeh error Next.js build ya runtime par dikhega agar variable nahi hai
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export default async function AdmindbConnect() {
  if (cached.conn) {
    console.log("Using existing database connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("Creating new database connection...");
    cached.promise = mongoose.connect(MONGODB_URI, {
      // useNewUrlParser: true, // Deprecated in Mongoose 6+
      // useUnifiedTopology: true, // Deprecated in Mongoose 6+
      bufferCommands: false, // Ensures commands are not buffered if connection is down
      serverSelectionTimeoutMS: 5000, // Koshish karega 5 seconds tak connect karne ki
    }).then((mongoose) => {
      console.log("MongoDB Connected!");
      return mongoose;
    }).catch(error => {
      console.error("MongoDB connection error:", error);
      cached.promise = null; // Agar connection fail ho toh promise reset kar dein
      throw error; // Error ko re-throw karein taaki calling function ko pata chale
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}