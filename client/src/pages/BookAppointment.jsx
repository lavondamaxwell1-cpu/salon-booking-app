import { useParams } from "react-router-dom";

function BookAppointment() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-pink-50 px-6 py-16">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-8">
        <p className="text-pink-500 font-semibold uppercase tracking-widest mb-3">
          Book Appointment
        </p>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Schedule Your Visit
        </h1>

        <form className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Select Service
            </label>
            <select className="w-full border border-pink-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400">
              <option>Knotless Braids</option>
              <option>Box Braids</option>
              <option>Feed-In Braids</option>
              <option>Silk Press</option>
              <option>Hair Color</option>
              <option>Extensions Install</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Appointment Date
            </label>
            <input
              type="date"
              className="w-full border border-pink-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Appointment Time
            </label>
            <select className="w-full border border-pink-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400">
              <option>9:00 AM</option>
              <option>10:00 AM</option>
              <option>11:00 AM</option>
              <option>1:00 PM</option>
              <option>2:00 PM</option>
              <option>3:00 PM</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Notes
            </label>
            <textarea
              rows="4"
              placeholder="Tell your stylist anything important..."
              className="w-full border border-pink-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-full text-lg font-semibold transition"
          >
            Confirm Booking
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-6">
          Booking for stylist ID: {id}
        </p>
      </div>
    </div>
  );
}

export default BookAppointment;
