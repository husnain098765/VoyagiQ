// File: app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// ✅ AuthProvider ko import karein
import AuthProvider from "@/Components/AuthProvider"; 
import Navbar from "@/Components/Navbar";
import Sidebar from "@/Components/Sidebar";
import Footer from "@/Components/Footer";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "VoyagiQ",
  description: "AI-based Smart Travel Planner & Recommendation System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* AuthProvider ko yahan wrap kiya */}
      <AuthProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 flex flex-col min-h-screen`}
        >
          {/* Sticky Navbar */}
          <Navbar />
          
          {/* Sidebar + Content */}
          <div className="flex flex-1">
            <Sidebar />
            <div className="flex flex-col flex-1">
              {/* Page specific content only */}
              <main className="flex-1 p-6">{children}</main>

              {/* Footer just below content */}
              <Footer />
            </div>
          </div>
        </body>
      </AuthProvider>
      <Analytics />
      <SpeedInsights />
    </html>
  );
}
