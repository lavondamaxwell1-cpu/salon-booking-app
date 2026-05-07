import { useEffect, useState } from "react";
import {
  getAllAppointments,
  updateAppointmentStatus,
} from "../api/appointments";

function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const res = await getAllAppointments();
        setAppointments(res.data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to load appointments",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, []);

 async function updateStatus(id, newStatus) {
   try {
     await updateAppointmentStatus(id, newStatus);

     const res = await getAllAppointments();
     setAppointments(res.data);
   } catch (error) {
     setError(error.response?.data?.message || "Failed to update status");
   }
 }
  

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <p className="text-pink-500 font-semibold text-xl">
          Loading appointments...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <p className="text-pink-500 font-semibold uppercase tracking-widest mb-3">
          Admin Dashboard
        </p>

        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-10">
          Manage Salon
        </h1>

        {error && (
          <p className="bg-red-100 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </p>
        )}

        {appointments.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              No appointments yet
            </h2>

            <p className="text-gray-500">Customer bookings will appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white rounded-3xl shadow-lg p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {appointment.service}
                  </h2>

                  <p className="text-gray-600 mt-1">
                    Customer: {appointment.customer?.name || "Customer"}
                  </p>

                  <p className="text-gray-600">
                    Email: {appointment.customer?.email || "No email"}
                  </p>

                  <p className="text-gray-600">
                    Stylist: {appointment.stylist}
                  </p>

                  <p className="text-gray-600">
                    {appointment.date} at {appointment.time}
                  </p>

                  {appointment.notes && (
                    <p className="text-gray-500 mt-2">
                      Notes: {appointment.notes}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  <span
                    className={`px-4 py-2 rounded-full font-semibold text-sm text-center ${
                      appointment.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : appointment.status === "Completed"
                          ? "bg-blue-100 text-blue-700"
                          : appointment.status === "Canceled"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {appointment.status}
                  </span>

                  <button
                    onClick={() => updateStatus(appointment._id, "Confirmed")}
                    className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full font-semibold transition"
                  >
                    Confirm
                  </button>

                  <button
                    onClick={() => updateStatus(appointment._id, "Completed")}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full font-semibold transition"
                  >
                    Complete
                  </button>

                  <button
                    onClick={() => updateStatus(appointment._id, "Canceled")}
                    className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
