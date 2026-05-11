// app/admin/components/UsersTable.js
import AdmindbConnect from "@/lib/models/AdmindbConnect";
import AdminUser from "@/lib/models/AdminUser";

export default async function UsersTable() {
  await AdmindbConnect();
  const users = await AdminUser.find().lean();

  return (
    <div className="bg-white shadow rounded-xl p-6 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Registered Users</h2>
      {users.length === 0 && <p className="text-gray-500">No users found.</p>}
      {users.length > 0 && (
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3">{u._id}</td>
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
