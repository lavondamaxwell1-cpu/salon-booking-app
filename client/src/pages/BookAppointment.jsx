import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { createAppointment, getBookedTimes } from "../api/appointments";
import { getStylistById } from "../api/stylists";

function BookAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookedTimes, setBookedTimes] = useState([]);
  const [stylist, setStylist] = useState(null);
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("9:00 AM");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const availableTimes = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
  ];
  useEffect(() => {
    async function fetchStylist() {
      try {
        const res = await getStylistById(id);
        setStylist(res.data);

        if (res.data.services?.length > 0) {
          setService(res.data.services[0].name);
        }
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load stylist");
      } finally {
        setLoading(false);
      }
    }

    fetchStylist();
  }, [id]);
  useEffect(() => {
    async function fetchBookedTimes() {
      if (!id || !date) return;

      try {
        const res = await getBookedTimes(id, date);
        setBookedTimes(res.data);
      } catch (error) {
        console.log(
          error.response?.data?.message || "Failed to load booked times",
        );
      }
    }

    fetchBookedTimes();
  }, [id, date]);
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await createAppointment({
        stylistId: stylist._id,
        stylist: stylist.name,
        service,
        date,
        time,
        notes,
      });

      navigate("/my-appointments");
    } catch (error) {
      setError(error.response?.data?.message || "Booking failed");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <p className="text-pink-500 font-semibold text-xl">
          Loading booking page...
        </p>
      </div>
    );
  }

  if (!stylist) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <p className="text-red-500 font-semibold text-xl">Stylist not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 px-6 py-16">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-8">
        <p className="text-pink-500 font-semibold uppercase tracking-widest mb-3">
          Book Appointment
        </p>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Schedule with {stylist.name}
        </h1>

        <p className="text-gray-500 mb-8">{stylist.specialty}</p>

        {error && (
          <p className="bg-red-100 text-red-700 px-4 py-3 rounded-xl mb-5">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Select Service
            </label>

            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full border border-pink-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            >
              {stylist.services?.map((service) => (
                <option key={service._id || service.name} value={service.name}>
                  {service.name} — {service.price} · {service.duration}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Appointment Date
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-pink-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Appointment Time
            </label>

            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border border-pink-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              {availableTimes.map((slot) => (
                <option
                  key={slot}
                  value={slot}
                  disabled={bookedTimes.includes(slot)}
                >
                  {slot} {bookedTimes.includes(slot) ? "(Booked)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Notes
            </label>

            <textarea
              rows="4"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tell your stylist anything important..."
              className="w-full border border-pink-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-full text-lg font-semibold transition">
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookAppointment;
