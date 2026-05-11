// src/app/api/register/route.js
// NextAuth adapter sirf login aur session handle karta hai. 

import { NextResponse } from 'next/server';
import clientPromise from "@/lib/mongodb_client"; // MongoDB Client for raw access
import * as bcrypt from 'bcrypt';

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Missing name, email, or password" }, { status: 400 });
        }
        
        // 1. Connection and Collection Access
        const client = await clientPromise;
        const db = client.db();
        // NextAuth default 'users' collection use karta hai
        const usersCollection = db.collection('users'); 

        // 2. Check for existing user
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
        }

        // 3. Hash the password (CRUCIAL)
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // 4. Insert new user
        const result = await usersCollection.insertOne({
            name,
            email,
            password: hashedPassword,
            createdAt: new Date(),
        });

        // NextAuth ko database mein user mil jayega, aur ismein woh password check karega.

        return NextResponse.json({ 
            message: "User registered successfully", 
            userId: result.insertedId 
        }, { status: 201 });

    } catch (error) {
        console.error("❌ Registration Error:", error);
        return NextResponse.json({ error: "Internal Server Error during registration" }, { status: 500 });
    }
}