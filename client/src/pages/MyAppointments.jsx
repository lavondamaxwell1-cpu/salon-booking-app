import { useEffect, useState } from "react";
import { getMyAppointments, cancelAppointment } from "../api/appointments";
import { createCheckoutSession } from "../api/payments";
function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const res = await getMyAppointments();
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
async function handleCancel(id) {
  try {
    await cancelAppointment(id);

    const res = await getMyAppointments();
    setAppointments(res.data);
  } catch (error) {
    setError(error.response?.data?.message || "Failed to cancel appointment");
  }
}

async function handlePay(appointmentId) {
  try {
    const res = await createCheckoutSession(appointmentId);
    window.location.href = res.data.url;
  } catch (error) {
    setError(error.response?.data?.message || "Payment failed");
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
      <div className="max-w-5xl mx-auto">
        <p className="text-pink-500 font-semibold uppercase tracking-widest mb-3">
          Your Schedule
        </p>

        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-10">
          My Appointments
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

            <p className="text-gray-500">Book your first salon appointment.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white rounded-3xl shadow-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {appointment.service}
                  </h2>

                  <p className="text-gray-600 mt-1">
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

                <span
                  className={`px-4 py-2 rounded-full font-semibold text-sm ${
                    appointment.status === "Confirmed"
                      ? "bg-green-100 text-green-700"
                      : appointment.status === "Completed"
                        ? "bg-blue-100 text-blue-700"
                        : appointment.status === "Canceled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {appointment.status !== "Canceled" && (
                    <button
                      onClick={() => handleCancel(appointment._id)}
                      className="border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white px-5 py-2 rounded-full font-semibold transition"
                    >
                      Cancel
                    </button>
                  )}
                  {appointment.paymentStatus !== "Paid" &&
                    appointment.status !== "Canceled" && (
                      <button
                        onClick={() => handlePay(appointment._id)}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-full font-semibold transition"
                      >
                        Pay Deposit
                      </button>
                    )}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAppointments;
