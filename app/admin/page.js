import AdmindbConnect from "@/lib/models/AdmindbConnect";
import AdminUser from "@/lib/models/AdminUser";
import AdminTrip from "@/lib/models/AdminTrip";

export default async function Dashboard() {
  let totalUsers = 0;
  let totalTrips = 0;
  let completedTrips = 0;
  let error = null;

  try {
    await AdmindbConnect(); // Ensure connection is established
    console.log("Fetching dashboard data...");
    [totalUsers, totalTrips, completedTrips] = await Promise.all([
      AdminUser.countDocuments(),
      AdminTrip.countDocuments(),
      AdminTrip.countDocuments({ status: "completed" }),
    ]);
    console.log("Dashboard data fetched successfully:", { totalUsers, totalTrips, completedTrips });
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    error = "Failed to load dashboard data. Please check your database connection.";
  }

  return (
    <div className="space-y-10">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow p-6 rounded-xl">
          <h3 className="text-gray-700 font-semibold text-lg">Total Users</h3>
          <p className="text-3xl font-bold mt-2">{totalUsers}</p>
        </div>

        <div className="bg-white shadow p-6 rounded-xl">
          <h3 className="text-gray-700 font-semibold text-lg">Total Trips</h3>
          <p className="text-3xl font-bold mt-2">{totalTrips}</p>
        </div>

        <div className="bg-white shadow p-6 rounded-xl">
          <h3 className="text-gray-700 font-semibold text-lg">Completed Trips</h3>
          <p className="text-3xl font-bold mt-2">{completedTrips}</p>
        </div>
      </div>
    </div>
  );
}