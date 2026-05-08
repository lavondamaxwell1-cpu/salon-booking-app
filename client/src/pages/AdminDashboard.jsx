import { useEffect, useState } from "react";
import {
  getAllAppointments,
  updateAppointmentStatus,
} from "../api/appointments";
import { getAdminStats } from "../api/admin";
import socket from "../api/socket";

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchAppointments() {
    try {
      const res = await getAllAppointments();
      setAppointments(res.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }

  async function fetchStats() {
    try {
      const res = await getAdminStats();
      setStats(res.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load stats");
    }
  }

  async function refreshAdminData() {
    await fetchAppointments();
    await fetchStats();
  }

  async function updateStatus(id, newStatus) {
    try {
      await updateAppointmentStatus(id, newStatus);
      await refreshAdminData();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update status");
    }
  }

  useEffect(() => {
    async function loadAdminData() {
      await refreshAdminData();
    }

    loadAdminData();

    socket.on("appointmentCreated", refreshAdminData);
    socket.on("appointmentUpdated", refreshAdminData);
    socket.on("appointmentCanceled", refreshAdminData);

    return () => {
      socket.off("appointmentCreated", refreshAdminData);
      socket.off("appointmentUpdated", refreshAdminData);
      socket.off("appointmentCanceled", refreshAdminData);
    };
  }, []);

  const doughnutData = stats
    ? {
        labels: ["Paid", "Unpaid", "Completed", "Canceled"],
        datasets: [
          {
            data: [
              stats.paidAppointments,
              stats.unpaidAppointments,
              stats.completedAppointments,
              stats.canceledAppointments,
            ],
            backgroundColor: ["#22c55e", "#f59e0b", "#3b82f6", "#ef4444"],
            borderWidth: 0,
          },
        ],
      }
    : null;

  const barData = stats
    ? {
        labels: ["Revenue", "Appointments", "Users", "Stylists"],
        datasets: [
          {
            label: "Salon Analytics",
            data: [
              stats.estimatedRevenue,
              stats.totalAppointments,
              stats.totalUsers,
              stats.totalStylists,
            ],
            backgroundColor: "#ec4899",
            borderRadius: 12,
          },
        ],
      }
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <p className="text-pink-500 font-semibold text-xl">
          Loading admin dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 px-6 py-16">
      <div className="max-w-7xl mx-auto">
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

        {stats && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard
              title="Total Appointments"
              value={stats.totalAppointments}
            />
            <StatCard
              title="Today's Appointments"
              value={stats.todaysAppointments}
            />
            <StatCard
              title="Paid"
              value={stats.paidAppointments}
              color="text-green-600"
            />
            <StatCard
              title="Unpaid"
              value={stats.unpaidAppointments}
              color="text-yellow-600"
            />
            <StatCard
              title="Completed"
              value={stats.completedAppointments}
              color="text-blue-600"
            />
            <StatCard
              title="Canceled"
              value={stats.canceledAppointments}
              color="text-red-600"
            />
            <StatCard
              title="Stylists"
              value={stats.totalStylists}
              color="text-pink-500"
            />
            <StatCard
              title="Estimated Revenue"
              value={`$${stats.estimatedRevenue}`}
            />
          </div>
        )}

        {stats && doughnutData && barData && (
          <div className="grid lg:grid-cols-2 gap-6 mb-10">
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Appointment Status
              </h2>

              <div className="max-w-sm mx-auto">
                <Doughnut data={doughnutData} />
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Salon Overview
              </h2>

              <Bar
                data={barData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          </div>
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

                  <p className="text-gray-600">
                    Payment: {appointment.paymentStatus}
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

function StatCard({ title, value, color = "text-gray-900" }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <p className="text-gray-500">{title}</p>
      <h2 className={`text-4xl font-bold ${color}`}>{value}</h2>
    </div>
  );
}

export default AdminDashboard;
