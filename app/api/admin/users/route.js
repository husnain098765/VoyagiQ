// app/api/admin/users/route.js (for GET all users)
import { NextResponse } from 'next/server';
import AdmindbConnect from "@/lib/models/AdmindbConnect";
import AdminUser from "@/lib/models/AdminUser";

export async function GET() {
  try {
    await AdmindbConnect();
    const users = await AdminUser.find().lean();
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ message: "Failed to fetch users.", error: error.message }, { status: 500 });
  }
}