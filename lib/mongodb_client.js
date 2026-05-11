// src/lib/mongodb_client.js
// 🚨 NOTE: This file is created specifically for the NextAuth MongoDB Adapter.
// Your existing Mongoose setup in src/lib/mongodb.js will remain untouched.

import { MongoClient } from 'mongodb';

// Ensure MONGODB_URI is set in .env.local
const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("❌ Please add your MONGODB_URI to .env.local");
}

let client;
let clientPromise;

// Recommended approach for Next.js to reuse the connection
if (process.env.NODE_ENV === "development") {
  // Development mode mein, global variable use karte hain taaki client har hot reload par re-initialize na ho
  if (!global._mongoClientPromiseForNextAuth) { // Naya global variable name use kiya
    client = new MongoClient(uri);
    global._mongoClientPromiseForNextAuth = client.connect();
  }
  clientPromise = global._mongoClientPromiseForNextAuth;
} else {
  // Production mode mein, normally connect karein
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

// Export the MongoClient promise for the NextAuth adapter.
export default clientPromise;