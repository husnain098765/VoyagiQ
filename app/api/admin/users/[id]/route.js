// app/api/admin/users/[id]/route.js
import { NextResponse } from 'next/server';
import AdmindbConnect from "@/lib/models/AdmindbConnect";
import AdminUser from "@/lib/models/AdminUser";

// DELETE handler
export async function DELETE(request, { params }) {
  const { id } = await params; 

  if (!id) {
    return NextResponse.json({ message: "User ID is required." }, { status: 400 });
  }

  try {
    await AdmindbConnect();
    const deletedUser = await AdminUser.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully.", userId: id }, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ message: "Failed to delete user.", error: error.message }, { status: 500 });
  }
}

// PUT handler (for updating a user)
export async function PUT(request, { params }) {
  const { id } = await params; 
  const body = await request.json(); // Get the updated data from the request body

  if (!id) {
    return NextResponse.json({ message: "User ID is required for update." }, { status: 400 });
  }

  try {
    await AdmindbConnect();
    const updatedUser = await AdminUser.findByIdAndUpdate(id, body, { new: true, runValidators: true }); // {new: true} returns the updated document

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found for update." }, { status: 404 });
    }

    return NextResponse.json({ message: "User updated successfully.", user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    // Check for Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({ message: "Validation error", errors: messages }, { status: 400 });
    }
    return NextResponse.json({ message: "Failed to update user.", error: error.message }, { status: 500 });
  }
}