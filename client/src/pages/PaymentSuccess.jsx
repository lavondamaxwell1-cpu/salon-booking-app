import { Link } from "react-router-dom";

function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-lg p-10 text-center max-w-md">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Payment Successful
        </h1>

        <p className="text-gray-500 mb-6">
          Your appointment payment was received.
        </p>

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
