import { useEffect, useState } from "react";
import { getUsers, updateUserRole, deleteUser } from "../api/users";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 useEffect(() => {
   async function fetchUsers() {
     try {
       const res = await getUsers();
       setUsers(res.data);
     } catch (error) {
       setError(error.response?.data?.message || "Failed to load users");
     } finally {
       setLoading(false);
     }
   }

   fetchUsers();
 }, []);
  async function handleRoleChange(id, role) {
    try {
      await updateUserRole(id, role);
      const res = await getUsers();
      setUsers(res.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update role");
    }
  }

async function handleDeleteUser(id, name) {
  const confirmDelete = window.confirm(
    `Are you sure you want to delete ${name}? This cannot be undone.`,
  );

  if (!confirmDelete) return;

  try {
    await deleteUser(id);

    const res = await getUsers();
    setUsers(res.data);
  } catch (error) {
    setError(error.response?.data?.message || "Failed to delete user");
  }
}
  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <p className="text-pink-500 font-semibold text-xl">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <p className="text-pink-500 font-semibold uppercase tracking-widest mb-3">
          Admin
        </p>

        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-10">
          Manage Users
        </h1>

        {error && (
          <p className="bg-red-100 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </p>
        )}

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-pink-500 text-white font-bold p-5">
            <p>Name</p>
            <p>Email</p>
            <p>Current Role</p>
            <p>Change Role</p>
          </div>

          {users.map((user) => (
            <div
              key={user._id}
              className="grid grid-cols-1 md:grid-cols-5 gap-4 p-5 border-b border-pink-100 items-center"
            >
              <p className="font-semibold text-gray-900">{user.name}</p>

              <p className="text-gray-600">{user.email}</p>

              <span className="text-pink-500 font-bold capitalize">
                {user.role}
              </span>

              <select
                value={user.role}
                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                className="border border-pink-100 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <option value="customer">Customer</option>
                <option value="stylist">Stylist</option>
                <option value="admin">Admin</option>
              </select>
              <button
                onClick={() => handleDeleteUser(user._id, user.name)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-semibold transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;
