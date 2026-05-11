// app/api/admin/trips/route.js (for GET all trips)
import { NextResponse } from 'next/server';
import AdmindbConnect from "@/lib/models/AdmindbConnect";
import AdminTrip from "@/lib/models/AdminTrip";

export async function GET() {
  try {
    await AdmindbConnect();
    const trips = await AdminTrip.find().lean();
    return NextResponse.json({ trips }, { status: 200 });
  } catch (error) {
    console.error("Error fetching trips:", error);
    return NextResponse.json({ message: "Failed to fetch trips.", error: error.message }, { status: 500 });
  }
}