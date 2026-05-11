// app/admin/components/AdminActions.js
"use client"; 

import { useRouter } from "next/navigation";
import { useState } from "react";

//  SVG icons for Edit (Pencil) and Delete (Dustbin) from Heroicons
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

export default function AdminActions({ itemId, type }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    console.log(`Navigating to edit ${type} with ID:`, itemId);
    // Redirect to the edit page for the specific item
    router.push(`/admin/${type}s/edit/${itemId}`);
  };

  const handleDelete = async () => {
    console.log(`Deleting ${type} with ID:`, itemId);
    if (confirm(`Are you sure you want to delete this ${type} with ID: ${itemId}?`)) {
      setIsDeleting(true);
      try {
        const response = await fetch(`/api/admin/${type}s/${itemId}`, { method: 'DELETE' });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to delete ${type}.`);
        }
        alert(`${type} with ID: ${itemId} deleted successfully!`);
        router.refresh(); // Re-fetches data for the parent Server Component
      } catch (err) {
        console.error(`Error deleting ${type}:`, err);
        alert(`Failed to delete ${type}: ${err.message}`);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleEdit}
        className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        title={`Edit ${type}`}
      >
        <EditIcon /> Edit
      </button>
      <button
        onClick={handleDelete}
        className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title={`Delete ${type}`}
        disabled={isDeleting}
      >
        {isDeleting ? 'Deleting...' : <><DeleteIcon /> Delete</>}
      </button>
    </div>
  );
}