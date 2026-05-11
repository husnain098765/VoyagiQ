import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Trip from "@/lib/models/Trip";

// ===================== DELETE TRIP =====================
export async function DELETE(req, context) {
    try {
        await connectDB();
        
        const { id } = await context.params;

        if (!id) {
            return NextResponse.json(
                { success: false, message: "ID is missing" },
                { status: 400 }
            );
        }

        const deleted = await Trip.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json(
                { success: false, message: "Trip not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Trip deleted successfully",
        });
    } catch (err) {
        console.error("Delete Error:", err);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}

// ===================== PATCH (MARK AS COMPLETE) =====================
export async function PATCH(req, context) {
    try {
        await connectDB();

        const { id } = await context.params;

        if (!id) {
            return NextResponse.json(
                { success: false, message: "ID is missing" },
                { status: 400 }
            );
        }

        //  Set status to "completed" AND save completedAt date
        const updatedTrip = await Trip.findByIdAndUpdate(
            id,
            { status: "completed", completedAt: new Date() },
            { new: true }
        );

        if (!updatedTrip) {
            return NextResponse.json(
                { success: false, message: "Trip not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, trip: updatedTrip });
    } catch (err) {
        console.error("Update Error:", err);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
