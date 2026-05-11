// app/api/admin/trips/[id]/route.js
import { NextResponse } from 'next/server';
import AdmindbConnect from "@/lib/models/AdmindbConnect";
import AdminTrip from "@/lib/models/AdminTrip";

// DELETE handler
export async function DELETE(request, { params }) {
  
  const { id } = await params; 

  if (!id) {
    return NextResponse.json({ message: "Trip ID is required." }, { status: 400 });
  }

  try {
    await AdmindbConnect();
    const deletedTrip = await AdminTrip.findByIdAndDelete(id);

    if (!deletedTrip) {
      return NextResponse.json({ message: "Trip not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Trip deleted successfully.", tripId: id }, { status: 200 });
  } catch (error) {
    console.error("Error deleting trip:", error);
    return NextResponse.json({ message: "Failed to delete trip.", error: error.message }, { status: 500 });
  }
}

// PUT handler (for updating a trip)
export async function PUT(request, { params }) {
  
  const { id } = await params; 
  const body = await request.json(); // Get the updated data from the request body

  if (!id) {
    return NextResponse.json({ message: "Trip ID is required for update." }, { status: 400 });
  }

  try {
    await AdmindbConnect();
    const updatedTrip = await AdminTrip.findByIdAndUpdate(id, body, { new: true, runValidators: true }); // {new: true} returns the updated document

    if (!updatedTrip) {
      return NextResponse.json({ message: "Trip not found for update." }, { status: 404 });
    }

    return NextResponse.json({ message: "Trip updated successfully.", trip: updatedTrip }, { status: 200 });
  } catch (error) {
    console.error("Error updating trip:", error);
    // Check for Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({ message: "Validation error", errors: messages }, { status: 400 });
    }
    return NextResponse.json({ message: "Failed to update trip.", error: error.message }, { status: 500 });
  }
}