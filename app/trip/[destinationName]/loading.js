// /app/trip/[destinationName]/loading.js

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <p className="ml-4 text-indigo-600">Generating your personalized trip...</p>
    </div>
  );
}