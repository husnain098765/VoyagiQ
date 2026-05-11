// src/components/AuthProvider.jsx
"use client";

import { SessionProvider } from "next-auth/react";

// SessionProvider ko client components tak pahunchane ke liye
export default function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}