"use client";

export default function HelpPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold text-indigo-700 mb-4">🛠️ Help & Guide</h1>

      <section className="bg-indigo-50 p-6 rounded-lg shadow-sm space-y-3">
        <h2 className="text-2xl font-semibold text-indigo-800">App Overview</h2>
        <p className="text-gray-700">
          VoyagiQ is your AI-powered travel planner. You can search destinations, generate personalized itineraries, estimate budgets, and save trips for later.
        </p>
      </section>

      <section className="bg-green-50 p-6 rounded-lg shadow-sm space-y-3">
        <h2 className="text-2xl font-semibold text-green-800">How to Generate Itineraries</h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-2">
          <li>Login or Register an account.</li>
          <li>Search for your desired destination.</li>
          <li>Click “Generate AI Itinerary” to get a suggested travel plan.</li>
          <li>Review the itinerary and make adjustments if needed.</li>
          <li>Save the trip to view it later or mark it as complete once finished.</li>
        </ol>
      </section>

      <section className="bg-yellow-50 p-6 rounded-lg shadow-sm space-y-3">
        <h2 className="text-2xl font-semibold text-yellow-800">Tips & Guidance</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>You can explore hotels, restaurants, and attractions interactively on the map.</li>
          <li>Use the “Previous Trips” page to revisit completed itineraries.</li>
          <li>Mark trips as complete to track your travel history.</li>
          <li>Adjust your preferences like budget, interests, and number of members for personalized recommendations.</li>
        </ul>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-sm space-y-3 border">
        <h2 className="text-2xl font-semibold text-gray-800">Need More Help?</h2>
        <p className="text-gray-700">
          For further assistance, contact our support team at <a href="mailto:husnaineditor098765@gmail.com" className="text-indigo-600 underline">husnaineditor098765@gmail.com</a>.
        </p>
      </section>
    </div>
  );
}
