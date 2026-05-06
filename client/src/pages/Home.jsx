// import React from 'react'

import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-pink-50">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT SIDE */}
        <div>
          <p className="text-pink-500 font-semibold mb-4 uppercase tracking-widest">
            Luxury Salon Experience
          </p>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-6">
            Book Your Next
            <span className="text-pink-500"> Beauty </span>
            Appointment Online
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Discover talented stylists, browse trending hairstyles, and schedule
            appointments in minutes.
          </p>

          <div className="flex gap-4">
            <Link
              to="/stylists"
              className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition"
            >
              Browse Stylists
            </Link>

            <Link
              to="/register"
              className="border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white px-8 py-4 rounded-full text-lg font-semibold transition"
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
            className="rounded-3xl shadow-2xl w-full max-w-lg object-cover"
          />
        </div>
      </section>
    </div>
  );
}

export default Home;