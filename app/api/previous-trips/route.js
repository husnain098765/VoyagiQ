import connectDB from "@/lib/mongodb";
import Trip from "@/lib/models/Trip";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ===================== GET (FETCH COMPLETED TRIPS) =====================
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ success: false, error: "Not logged in" }, { status: 401 });
  }

  try {
    await connectDB();

    // Fetch trips with status 'completed'
    const trips = await Trip.find({
      userEmail: session.user.email,
      status: "completed",
    }).sort({ updatedAt: -1 });

    return Response.json({ success: true, trips }, { status: 200 });
  } catch (error) {
    console.error("FETCH COMPLETED ERROR:", error);
    return Response.json(
      { success: false, error: "Failed to fetch completed trips." },
      { status: 500 }
    );
  }
}