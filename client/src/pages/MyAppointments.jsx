import { useEffect, useState } from "react";
import { getMyAppointments, cancelAppointment } from "../api/appointments";
// import { createCheckoutSession } from "../api/payments";
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

// async function handlePay(appointmentId) {
//   try {
//     const res = await createCheckoutSession(appointmentId);
//     window.location.href = res.data.url;
//   } catch (error) {
//     setError(error.response?.data?.message || "Payment failed");
//   }
// }
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
   <div className="min-h-screen bg-pink-50 px-4 sm:px-6 py-8 sm:py-16">
     <div className="max-w-5xl mx-auto">
       <p className="text-pink-500 font-semibold uppercase tracking-widest mb-2 sm:mb-3 text-sm sm:text-base">
         Your Schedule
       </p>

       <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 sm:mb-10">
         My Appointments
       </h1>

       {error && (
         <p className="bg-red-100 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm sm:text-base">
           {error}
         </p>
       )}

       {appointments.length === 0 ? (
         <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-8 sm:p-10 text-center">
           <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
             No appointments yet
           </h2>

           <p className="text-gray-500 text-sm sm:text-base">
             Book your first salon appointment.
           </p>
         </div>
       ) : (
         <div className="space-y-6">
           {appointments.map((appointment) => (
             <div
               key={appointment._id}
               className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5"
             >
               <div className="flex-1">
                 <h2 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                   {appointment.service}
                 </h2>

                 <p className="text-gray-600 mt-1 text-sm sm:text-base">
                   Stylist: {appointment.stylist}
                 </p>

                 <p className="text-gray-600 text-sm sm:text-base">
                   {appointment.date} at {appointment.time}
                 </p>

                 <span
                   className={`inline-block mt-3 px-4 py-2 rounded-full font-semibold text-sm ${
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

                 {appointment.notes && (
                   <p className="text-gray-500 mt-3 text-sm sm:text-base break-words">
                     Notes: {appointment.notes}
                   </p>
                 )}
               </div>

               {/* <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto">
                 {appointment.status !== "Canceled" && (
                   <button
                     onClick={() => handleCancel(appointment._id)}
                     className="w-full sm:w-auto border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white px-5 py-3 rounded-full font-semibold transition"
                   >
                     Cancel
                   </button>
                 )} */}

                 <div className="flex flex-wrap gap-3 mt-4">
                   <span
                     className={`px-4 py-2 rounded-full font-semibold text-sm ${
                       appointment.paymentStatus === "Paid"
                         ? "bg-green-100 text-green-700"
                         : "bg-yellow-100 text-yellow-700"
                     }`}
                   >
                     {appointment.paymentStatus}
                   </span>

                   {appointment.status !== "Canceled" && (
                     <button
                       onClick={() => handleCancel(appointment._id)}
                       className="border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white px-5 py-2 rounded-full font-semibold transition"
                     >
                       Cancel
                     </button>
                   )}
                 </div>
               </div>
            //  </div>
           ))}
         </div>
       )}
     </div>
   </div>
 );
}

export default MyAppointments;
