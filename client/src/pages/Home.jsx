// import React from 'react'

import { Link } from "react-router-dom";

function Home() {
 return (
   <div className="min-h-screen bg-pink-50">
     {/* HERO SECTION */}
     <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 lg:py-24 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12 items-center">
       {/* LEFT SIDE */}
       <div className="text-center md:text-left">
         <p className="text-pink-500 font-semibold mb-3 sm:mb-4 uppercase tracking-widest text-sm sm:text-base">
           Luxury Salon Experience
         </p>

         <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-5 sm:mb-6">
           Book Your Next
           <span className="text-pink-500"> Beauty </span>
           Appointment Online
         </h1>

         <p className="text-base sm:text-lg text-gray-600 mb-7 sm:mb-8 max-w-xl mx-auto md:mx-0">
           Discover talented stylists, browse trending hairstyles, and schedule
           appointments in minutes.
         </p>

         <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
           <Link
             to="/stylists"
             className="w-full sm:w-auto text-center bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full text-base sm:text-lg font-semibold transition"
           >
             Browse Stylists
           </Link>

           <Link
             to="/register"
             className="w-full sm:w-auto text-center border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white px-8 py-4 rounded-full text-base sm:text-lg font-semibold transition"
           >
             Get Started
           </Link>
         </div>
       </div>

       {/* RIGHT SIDE */}
       <div className="flex justify-center">
         <img
           src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1200&auto=format&fit=crop"
           alt="Salon"
           className="rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md lg:max-w-lg h-[280px] sm:h-[380px] lg:h-[500px] object-cover"
         />
       </div>
     </section>
   </div>
 );
}

export default Home;