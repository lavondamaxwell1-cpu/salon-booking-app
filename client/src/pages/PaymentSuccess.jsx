import { Link } from "react-router-dom";

function PaymentSuccess() {
 return (
   <div className="min-h-screen bg-pink-50 flex items-center justify-center px-4 sm:px-6 py-10">
     <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-10 text-center">
       <div className="bg-green-50 border border-green-200 text-green-700 px-4 sm:px-5 py-4 rounded-2xl mb-6">
         <p className="font-bold text-lg sm:text-xl">
           Appointment Confirmed 🎉
         </p>

         <p className="mt-2 text-sm sm:text-base">
           Your payment was successful and a confirmation email has been sent.
         </p>
       </div>

       <Link
         to="/my-appointments"
         className="block w-full sm:inline-block sm:w-auto bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-semibold transition"
       >
         View Appointments
       </Link>
     </div>
   </div>
 );
}

export default PaymentSuccess;
