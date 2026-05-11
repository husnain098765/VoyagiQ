import mongoose from "mongoose";

const TripSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    destination: { type: String, required: true },
    summary: { type: String },
    mainImage: { type: String },
    estimatedTotalBudgetUSD: { type: Number },
    dailyPlan: { type: Array },

    //  New Fields from Hero Section
    budget: { type: String }, // e.g., "Mid-range", "Luxury"
    members: { type: Number }, // e.g., 2
    interests: { type: [String] }, // e.g., ["Adventure", "Food"]

    //  Status to manage Saved vs Previous
    status: { type: String, default: "saved", enum: ["saved", "completed"] },

    //  NEW FIELD → Completed Date
    completedAt: { type: Date },

    savedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Trip || mongoose.model("Trip", TripSchema);
