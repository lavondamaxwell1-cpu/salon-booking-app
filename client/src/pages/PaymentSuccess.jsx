import { Link } from "react-router-dom";

function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-lg p-10 text-center max-w-md">
        <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-2xl mb-6">
          <p className="font-bold text-lg">Appointment Confirmed 🎉</p>

          <p className="mt-1">
            Your payment was successful and a confirmation email has been sent.
          </p>
        </div>
        <Link
          to="/my-appointments"
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-semibold transition"
        >
          View Appointments
        </Link>
      </div>
    </div>
  );
}

export default PaymentSuccess;
