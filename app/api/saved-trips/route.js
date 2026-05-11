import connectDB from "@/lib/mongodb";
import Trip from "@/lib/models/Trip";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ===================== POST (SAVE NEW TRIP) =====================
export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ success: false, error: "Not logged in" }, { status: 401 });
  }

  try {
    await connectDB();
    const tripData = await req.json();

    const newTrip = new Trip({
      ...tripData,
      userEmail: session.user.email,
      status: "saved", // Default status
    });

    await newTrip.save();

    return Response.json(
      { success: true, tripId: newTrip._id },
      { status: 200 }
    );
  } catch (error) {
    console.error("SAVE ERROR:", error);
    return Response.json(
      { success: false, error: "Failed to save trip." },
      { status: 500 }
    );
  }
}

// ===================== GET (FETCH ONLY 'SAVED' TRIPS) =====================
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ success: false, error: "Not logged in" }, { status: 401 });
  }

  try {
    await connectDB();

    // Only fetch trips with status 'saved'
    const trips = await Trip.find({
      userEmail: session.user.email,
      status: "saved", 
    }).sort({ createdAt: -1 });

    return Response.json({ success: true, trips }, { status: 200 });
  } catch (error) {
    console.error("FETCH ERROR:", error);
    return Response.json(
      { success: false, error: "Failed to fetch trips." },
      { status: 500 }
    );
  }
}