import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ message: "MongoDB Connected!" });
  } catch (error) {
    return NextResponse.json({ message: "Connection Error", error: error.message });
  }
}
