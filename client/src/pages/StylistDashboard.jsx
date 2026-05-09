import { useEffect, useState } from "react";
import {
  getAllAppointments,
  updateAppointmentStatus,
} from "../api/appointments";

function StylistDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 useEffect(() => {
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
   <div className="min-h-screen bg-pink-50 px-4 sm:px-6 py-8 sm:py-16">
     <div className="max-w-6xl mx-auto">
       <p className="text-pink-500 font-semibold uppercase tracking-widest mb-2 sm:mb-3 text-sm sm:text-base">
         Stylist Dashboard
       </p>

       <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 sm:mb-10">
         Manage Appointments
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
             Customer bookings will appear here.
           </p>
         </div>
       ) : (
         <div className="space-y-6">
           {appointments.map((appointment) => (
             <div
               key={appointment._id}
               className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5"
             >
               <div className="flex-1">
                 <h2 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                   {appointment.service}
                 </h2>

                 <p className="text-gray-600 mt-1 text-sm sm:text-base">
                   Customer: {appointment.customer?.name || "Customer"}
                 </p>

                 <p className="text-gray-600 text-sm sm:text-base">
                   Stylist: {appointment.stylist}
                 </p>

                 <p className="text-gray-600 text-sm sm:text-base">
                   {appointment.date} at {appointment.time}
                 </p>

                 {appointment.notes && (
                   <p className="text-gray-500 mt-2 text-sm sm:text-base break-words">
                     Notes: {appointment.notes}
                   </p>
                 )}
               </div>

               <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
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
                   className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-full font-semibold transition"
                 >
                   Confirm
                 </button>

                 <button
                   onClick={() => updateStatus(appointment._id, "Completed")}
                   className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-full font-semibold transition"
                 >
                   Complete
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

export default StylistDashboard;
