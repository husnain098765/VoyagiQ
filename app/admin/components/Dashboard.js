// app/admin/components/Dashboard.js
import AdmindbConnect from "@/lib/models/AdmindbConnect";
import AdminUser from "@/lib/models/AdminUser";
import AdminTrip from "@/lib/models/AdminTrip";

export default async function Dashboard() {
  try {
    await AdmindbConnect();

    const [totalUsers, totalTrips, completedTrips] = await Promise.all([
      AdminUser.countDocuments(),
      AdminTrip.countDocuments(),
      AdminTrip.countDocuments({ status: "completed" }),
    ]);

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow p-6 rounded-xl">
          <h3 className="text-gray-700 font-semibold text-lg">Total Users</h3>
          <p className="text-3xl font-bold mt-2">{totalUsers ?? 0}</p>
        </div>

        <div className="bg-white shadow p-6 rounded-xl">
          <h3 className="text-gray-700 font-semibold text-lg">Total Trips</h3>
          <p className="text-3xl font-bold mt-2">{totalTrips ?? 0}</p>
        </div>

        <div className="bg-white shadow p-6 rounded-xl">
          <h3 className="text-gray-700 font-semibold text-lg">Completed Trips</h3>
          <p className="text-3xl font-bold mt-2">{completedTrips ?? 0}</p>
        </div>
      </div>
    );
  } catch (err) {
    console.error("Dashboard Error:", err);
    return (
      <div className="p-6 bg-red-100 text-red-700 rounded-xl">
        Failed to load dashboard data.
      </div>
    );
  }
}
