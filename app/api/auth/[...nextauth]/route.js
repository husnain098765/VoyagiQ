// src/app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb_client";
import * as bcrypt from 'bcrypt';
import { ObjectId } from "mongodb";

// IMPORTANT: Export kiya gaya
export const authOptions = {
    adapter: MongoDBAdapter(clientPromise),

    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials) {
                if (!credentials.email || !credentials.password) return null;

                try {
                    const client = await clientPromise;
                    const db = client.db();
                    const usersCollection = db.collection('users');

                    const user = await usersCollection.findOne({ email: credentials.email });
                    if (!user) return null;

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordValid) return null;

                    return {
                        id: user._id.toString(),
                        name: user.name || user.email.split('@')[0],
                        email: user.email,
                    };
                } catch (error) {
                    console.error("Authorization Error:", error);
                    return null;
                }
            }
        })
    ],

    session: {
        strategy: "jwt",
    },

    pages: {
        signIn: '/login',
        error: '/login',
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },

        async session({ session, token }) {
            if (token.id) {
                session.user.id = token.id;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
