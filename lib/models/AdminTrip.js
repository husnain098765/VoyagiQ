import mongoose from "mongoose";

const TripSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    destination: { type: String, required: true },
    summary: { type: String },
    mainImage: { type: String },
    estimatedTotalBudgetUSD: { type: Number },
    dailyPlan: { type: Array, default: [] },
    status: { type: String, default: "pending" },
  },
  {
    timestamps: true,
    collection: "trips", 
  }
);

export default mongoose.models.AdminTrip || mongoose.model("AdminTrip", TripSchema);