// app/admin/components/TripsTable.js
import AdmindbConnect from "@/lib/models/AdmindbConnect";
import AdminTrip from "@/lib/models/AdminTrip";

export default async function TripsTable() {
  try {
    await AdmindbConnect();
    const trips = await AdminTrip.find().sort({ createdAt: -1 }).lean();

    if (!trips || trips.length === 0) {
      return (
        <div className="bg-white shadow rounded-xl p-6 text-gray-500">
          No trips found.
        </div>
      );
    }

    return (
      <div className="bg-white shadow rounded-xl p-6 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Saved Trips</h2>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="p-3">User Email</th>
              <th className="p-3">Destination</th>
              <th className="p-3">Budget</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((t) => (
              <tr key={t._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3">{t.userEmail}</td>
                <td className="p-3 font-medium">{t.destination}</td>
                <td className="p-3">
                  {t.estimatedTotalBudgetUSD
                    ? `$${t.estimatedTotalBudgetUSD}`
                    : "—"}
                </td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                      t.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } catch (error) {
    console.error("TripsTable error:", error);
    return (
      <div className="p-6 bg-red-100 text-red-700 rounded-xl">
        Failed to load trips data.
      </div>
    );
  }
}
