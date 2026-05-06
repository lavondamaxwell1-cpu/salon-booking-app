// import React from 'react'

import { Link } from "react-router-dom";

function Stylists() {
  const stylists = [
    {
      id: 1,
      name: "Jessica Rose",
      specialty: "Braids Specialist",
      price: "$80 - $200",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Maya Johnson",
      specialty: "Silk Press & Natural Hair",
      price: "$65 - $150",
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "Tiana Brooks",
      specialty: "Color & Extensions",
      price: "$120 - $300",
      image:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=800&auto=format&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-pink-50 px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-pink-500 font-semibold uppercase tracking-widest mb-3">
            Meet Our Experts
          </p>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            Choose Your Stylist
          </h1>

          <p className="text-gray-600 mt-4 text-lg">
            Browse talented beauty professionals and book your next appointment.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {stylists.map((stylist) => (
            <div
              key={stylist.id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden hover:-translate-y-2 transition"
            >
              <img
                src={stylist.image}
                alt={stylist.name}
                className="w-full h-80 object-cover"
              />

              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {stylist.name}
                </h2>

                <p className="text-pink-500 font-semibold mt-2">
                  {stylist.specialty}
                </p>

                <p className="text-gray-600 mt-3">{stylist.price}</p>

                <Link
                  to={`/stylists/${stylist.id}`}
                  className="mt-6 inline-block w-full text-center bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-full font-semibold transition"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Stylists;