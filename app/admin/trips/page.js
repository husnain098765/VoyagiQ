// app/admin/trips/page.js
"use client"; // <--- This makes the entire page a Client Component

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Heroicons SVG icons
const EditIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-4 h-4"
    {...props}
  >
    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-14.714 14.714a2.625 2.625 0 000 3.712l3.713 3.712c.762.762 1.78.796 2.518.118l.194-.188 1.493-1.493 9.948-9.948a2.625 2.625 0 000-3.712zM15.25 10.5h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 010 1.5z" />
  </svg>
);

const SaveIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-4 h-4"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M19.904 1.41l2.676 2.675a.75.75 0 01-.132.955l-9.157 9.157a3.001 3.001 0 01-.89 1.129H8.25a.75.75 0 01-.75-.75v-1.996a3.001 3.001 0 011.129-.89L18.95 1.542a.75.75 0 01.954-.132zM12.986 6.832a.75.75 0 10-1.06 1.06l-.37-.369a1.501 1.501 0 01-.444-.891c-.066-.37-.119-.757-.16-.948l-.055-.246c-.021-.097-.008-.2.039-.286a.75.75 0 011.06-.038zm-1.87-2.736l-.022.023c-.113.113-.199.255-.258.411-.059.156-.089.324-.089.497 0 .438.257.818.629.986.372.169.805.088 1.1.002.348-.1.687-.278 1.005-.533l.267-.21a.75.75 0 00-.974-1.183zM15 12.75a.75.75 0 00-1.5 0v2.25H9.75v-2.25a.75.75 0 00-1.5 0v2.25a.75.75 0 00.75.75h5.5a.75.75 0 00.75-.75v-2.25z"
      clipRule="evenodd"
    />
    <path
      fillRule="evenodd"
      d="M12 18a.75.75 0 00.75-.75V15h1.5a.75.75 0 000-1.5h-1.5V12a.75.75 0 00-1.5 0v1.5H9.75a.75.75 0 000 1.5H11v2.25a.75.75 0 00.75.75H12zM3 17.25a2.25 2.25 0 012.25-2.25h1.25a.75.75 0 000-1.5H5.25A3.75 3.75 0 001.5 17.25v3a.75.75 0 001.5 0v-3zM21 17.25a.75.75 0 00-1.5 0v3a.75.75 0 001.5 0v-3zM1.5 20.25a.75.75 0 00.75.75h1.5a.75.75 0 000-1.5H2.25A.75.75 0 001.5 20.25zM21 20.25a.75.75 0 00-.75.75h-1.5a.75.75 0 000 1.5h1.5a.75.75 0 00.75-.75v-3z"
      clipRule="evenodd"
    />
  </svg>
);


const CancelIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-4 h-4"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
      clipRule="evenodd"
    />
  </svg>
);

const DeleteIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-4 h-4"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M16.5 4.478v.227a48.845 48.845 0 013.16 3.88c.24.455.448.917.632 1.393L20.5 13.5h-17c.231-.767.43-1.558.632-2.392A48.847 48.847 0 017.5 4.705v-.227C7.5 3.109 8.614 2 10.05 2h3.9c1.436 0 2.55 1.109 2.55 2.478zm-3.13 1.948h-3.9a.75.75 0 00-.745.698L9 11.25h6l-.025-4.127a.75.75 0 00-.745-.698zM5.503 16.25c.168.35.343.682.527.994a48.857 48.857 0 014.931 7.284L12 22l-.1.1a48.85 48.85 0 01-4.931-7.284c-.184-.312-.359-.644-.527-.994H5.503zm12.994 0h-.002c-.168.35-.343.682-.527.994a48.857 48.857 0 01-4.931 7.284L12 22l.1.1a48.85 48.85 0 014.931-7.284c.184-.312.359-.644.527-.994z"
      clipRule="evenodd"
    />
  </svg>
);


export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingTripId, setEditingTripId] = useState(null);
  const [editFormData, setEditFormData] = useState({}); // <--- This was incomplete
  const router = useRouter();

  // Data fetching (now client-side)
  useEffect(() => {
    async function fetchTrips() {
      try {
        setLoading(true);
        setError(null);

        
        const response = await fetch('/api/admin/trips');             
        if (!response.ok) {
          throw new Error('Failed to fetch trips from API.');
        }
        const data = await response.json();
        setTrips(data.trips);

      } catch (err) {
        console.error("Error fetching trips data:", err);
        setError("Failed to load trips data. Please ensure the /api/admin/trips GET route is set up correctly.");
      } finally {
        setLoading(false);
      }
    }
    fetchTrips();
  }, []); // Empty dependency array means this runs once on mount

  const getStatusDisplay = (status) => {
    switch (status) {
      case "completed":
        return { text: "Completed", className: "bg-green-100 text-green-700" };
      case "saved":
        return { text: "Saved", className: "bg-blue-100 text-blue-700" };
      case "pending":
      default:
        return { text: "Pending", className: "bg-yellow-100 text-yellow-700" };
    }
  };

  const handleEditClick = (trip) => {
    setEditingTripId(trip._id);
    setEditFormData({
      userEmail: trip.userEmail,
      destination: trip.destination,
      estimatedTotalBudgetUSD: trip.estimatedTotalBudgetUSD,
      status: trip.status,
    });
  };

  const handleCancelEdit = () => {
    setEditingTripId(null);
    setEditFormData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveEdit = async (tripId) => {
    if (!confirm("Are you sure you want to save these changes?")) return;

    try {
      const response = await fetch(`/api/admin/trips/${tripId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update trip.');
      }

      alert('Trip updated successfully!');
      setEditingTripId(null);
      setTrips(trips.map(trip => trip._id === tripId ? { ...trip, ...editFormData } : trip));
      // Optionally, you can call router.refresh() if you want to re-fetch all data from server
      // router.refresh();
    } catch (err) {
      console.error('Error saving trip:', err);
      alert(`Failed to save changes: ${err.message}`);
    }
  };

  const handleDelete = async (tripId) => {
    if (confirm(`Are you sure you want to delete trip with ID: ${tripId}?`)) {
      try {
        const response = await fetch(`/api/admin/trips/${tripId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete trip.');
        }

        alert(`Trip with ID: ${tripId} deleted successfully!`);
        setTrips(trips.filter(trip => trip._id !== tripId)); // Remove from UI
        // router.refresh(); // Or re-fetch data if preferred
      } catch (err) {
        console.error('Error deleting trip:', err);
        alert(`Failed to delete trip: ${err.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Loading trips...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-xl p-6 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Saved Trips</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {trips.length === 0 && !error ? (
        <p>No trips found.</p>
      ) : (
        !error && (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="p-3">User Email</th>
                <th className="p-3">Destination</th>
                <th className="p-3">Budget</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => {
                const statusDisplay = getStatusDisplay(trip.status);
                return (
                  <tr key={trip._id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3">
                      {editingTripId === trip._id ? (
                        <input
                          type="email"
                          name="userEmail"
                          value={editFormData.userEmail}
                          onChange={handleChange}
                          className="border rounded p-1 w-full"
                          required
                        />
                      ) : (
                        trip.userEmail
                      )}
                    </td>
                    <td className="p-3">
                      {editingTripId === trip._id ? (
                        <input
                          type="text"
                          name="destination"
                          value={editFormData.destination}
                          onChange={handleChange}
                          className="border rounded p-1 w-full"
                          required
                        />
                      ) : (
                        trip.destination
                      )}
                    </td>
                    <td className="p-3">
                      {editingTripId === trip._id ? (
                        <input
                          type="number"
                          name="estimatedTotalBudgetUSD"
                          value={editFormData.estimatedTotalBudgetUSD}
                          onChange={handleChange}
                          className="border rounded p-1 w-full"
                        />
                      ) : (
                        trip.estimatedTotalBudgetUSD ? `$${trip.estimatedTotalBudgetUSD}` : "—"
                      )}
                    </td>
                    <td className="p-3">
                      {editingTripId === trip._id ? (
                        <select
                          name="status"
                          value={editFormData.status}
                          onChange={handleChange}
                          className="border rounded p-1 w-full"
                          required
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="saved">Saved</option>
                        </select>
                      ) : (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusDisplay.className}`}
                        >
                          {statusDisplay.text}
                        </span>
                      )}
                    </td>
                    <td className="p-3 space-x-2 flex items-center">
                      {editingTripId === trip._id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(trip._id)}
                            className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                            title="Save Changes"
                          >
                            <SaveIcon /> Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex items-center gap-1 px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
                            title="Cancel Edit"
                          >
                            <CancelIcon /> Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditClick(trip)}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            title="Edit Trip"
                          >
                            <EditIcon /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(trip._id)}
                            className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                            title="Delete Trip"
                          >
                            <DeleteIcon /> Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )
      )}
    </div>
  );
}