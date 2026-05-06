// import React from 'react'
import { Link, useParams } from "react-router-dom";

function StylistDetails() {
  const { id } = useParams();

  const stylists = [
    {
      id: "1",
      name: "Jessica Rose",
      specialty: "Braids Specialist",
      bio: "Jessica specializes in protective styles, knotless braids, box braids, and feed-in braids.",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
      services: [
        { name: "Knotless Braids", price: "$180", duration: "4 hrs" },
        { name: "Box Braids", price: "$150", duration: "3.5 hrs" },
        { name: "Feed-In Braids", price: "$95", duration: "2 hrs" },
      ],
    },
    {
      id: "2",
      name: "Maya Johnson",
      specialty: "Silk Press & Natural Hair",
      bio: "Maya focuses on healthy hair care, silk presses, trims, and natural hair styling.",
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop",
      services: [
        { name: "Silk Press", price: "$85", duration: "1.5 hrs" },
        { name: "Natural Twist Out", price: "$75", duration: "1 hr" },
        { name: "Trim & Treatment", price: "$60", duration: "45 mins" },
      ],
    },
    {
      id: "3",
      name: "Tiana Brooks",
      specialty: "Color & Extensions",
      bio: "Tiana creates bold color looks, installs extensions, and customizes glam transformations.",
      image:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=800&auto=format&fit=crop",
      services: [
        { name: "Hair Color", price: "$140", duration: "2.5 hrs" },
        { name: "Extensions Install", price: "$250", duration: "3 hrs" },
        { name: "Full Glam Style", price: "$120", duration: "2 hrs" },
      ],
    },
  ];

  const stylist = stylists.find((person) => person.id === id);

  if (!stylist) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-800">Stylist not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <Link to="/stylists" className="text-pink-500 font-semibold">
          ← Back to Stylists
        </Link>

        <div className="grid md:grid-cols-2 gap-10 mt-8 items-start">
          <img
            src={stylist.image}
            alt={stylist.name}
            className="w-full h-[520px] object-cover rounded-3xl shadow-xl"
          />

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <p className="text-pink-500 font-semibold uppercase tracking-widest mb-3">
              {stylist.specialty}
            </p>

            <h1 className="text-5xl font-bold text-gray-900 mb-5">
              {stylist.name}
            </h1>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {stylist.bio}
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-5">Services</h2>

            <div className="space-y-4">
              {stylist.services.map((service) => (
                <div
                  key={service.name}
                  className="border border-pink-100 rounded-2xl p-5 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {service.name}
                    </h3>
                    <p className="text-gray-500">{service.duration}</p>
                  </div>

                  <p className="text-pink-500 font-bold text-lg">
                    {service.price}
                  </p>
                </div>
              ))}
            </div>

            <Link
              to={`/book/${stylist.id}`}
              className="mt-8 block w-full text-center bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-full text-lg font-semibold transition"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StylistDetails;