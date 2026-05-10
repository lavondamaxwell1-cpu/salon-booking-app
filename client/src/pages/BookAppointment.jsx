import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { createAppointment, getBookedTimes } from "../api/appointments";
import { getStylistById } from "../api/stylists";
import { createCheckoutSession } from "../api/payments";
function BookAppointment() {
  const { id } = useParams();


  const [stylist, setStylist] = useState(null);
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isBlockedDate = stylist?.blockedDates?.includes(date);

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
    async function loadAvailableTimes() {
      if (!stylist || !date) {
        setAvailableTimes([]);
        setTime("");
        return;
      }

      const selectedDay = new Date(`${date}T12:00:00`).toLocaleDateString(
        "en-US",
        { weekday: "long" }
      );

      const availabilityForDay = stylist.availability?.find(
        (item) => item.day === selectedDay
      );

      if (!availabilityForDay) {
        setAvailableTimes([]);
        setTime("");
        return;
      }

      try {
        const res = await getBookedTimes(stylist._id, date);
        const bookedTimes = res.data;

        const filteredTimes = availabilityForDay.times.filter(
          (slot) => !bookedTimes.includes(slot)
        );

        setAvailableTimes(filteredTimes);
        setTime("");
      } catch (error) {
        console.log(
          "BOOKED TIMES ERROR:",
          error.response?.data || error.message
        );
      }
    }

    loadAvailableTimes();
  }, [stylist, date]);

 async function handleSubmit(e) {
   e.preventDefault();

   if (submitting) return;

   setSubmitting(true);
   setError("");

   try {
     const res = await createAppointment({
       stylistId: stylist._id,
       stylist: stylist.name,
       service,
       date,
       time,
       notes,
     });

     const paymentRes = await createCheckoutSession(res.data._id);

     window.location.href = paymentRes.data.url;
   } catch (error) {
     setError(error.response?.data?.message || "Booking failed");
   } finally {
     setSubmitting(false);
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
    <div className="min-h-screen bg-pink-50 px-4 sm:px-6 py-10 sm:py-16">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8">
        <p className="text-pink-500 font-semibold uppercase tracking-widest mb-2 sm:mb-3 text-sm sm:text-base">
          Book Appointment
        </p>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 break-words">
          {stylist?.name}
        </h1>

        {error && (
          <p className="bg-red-100 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm sm:text-base">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
              Service
            </label>

            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              required
              className="w-full border border-pink-100 rounded-xl px-4 py-3 text-sm sm:text-base"
            >
              <option value="">Select Service</option>

              {stylist?.services?.map((item) => (
                <option key={item._id || item.name} value={item.name}>
                  {item.name} — {item.price}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
              Appointment Date
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full border border-pink-100 rounded-xl px-4 py-3 text-sm sm:text-base"
            />

            {isBlockedDate && (
              <p className="text-red-500 font-semibold mt-2 text-sm">
                This stylist is unavailable on this date.
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
              Appointment Time
            </label>

            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              disabled={!date || availableTimes.length === 0}
              className="w-full border border-pink-100 rounded-xl px-4 py-3 text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="">
                {date ? "Select Available Time" : "Choose Date First"}
              </option>

              {availableTimes.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>

            {date && availableTimes.length === 0 && (
              <p className="text-red-500 font-semibold mt-2 text-sm">
                No available times for this date.
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
              Notes (Optional)
            </label>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
              placeholder="Add appointment notes..."
              className="w-full border border-pink-100 rounded-xl px-4 py-3 text-sm sm:text-base"
            />
          </div>

          <button
            type="submit"
            disabled={isBlockedDate || submitting}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookAppointment;