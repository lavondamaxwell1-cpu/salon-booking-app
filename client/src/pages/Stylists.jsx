import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStylists } from "../api/stylists";

function Stylists() {
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStylists() {
      try {
        const res = await getStylists();
        setStylists(res.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load stylists");
      } finally {
        setLoading(false);
      }
    }

    fetchStylists();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <p className="text-pink-500 font-semibold text-xl">
          Loading stylists...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 px-4 sm:px-6 py-8 sm:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-pink-500 font-semibold uppercase tracking-widest mb-2 sm:mb-3 text-sm sm:text-base">
            Meet Our Experts
          </p>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
            Choose Your Stylist
          </h1>

          <p className="text-gray-600 mt-4 text-base sm:text-lg max-w-2xl mx-auto">
            Browse talented beauty professionals and book your next appointment.
          </p>
        </div>

        {error && (
          <p className="bg-red-100 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm sm:text-base">
            {error}
          </p>
        )}

        {stylists.length === 0 ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-8 sm:p-10 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
              No stylists yet
            </h2>

            <p className="text-gray-500 text-sm sm:text-base">
              Stylists added in MongoDB will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {stylists.map((stylist) => (
              <div
                key={stylist._id}
                className="bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden hover:-translate-y-1 sm:hover:-translate-y-2 transition"
              >
                <img
                  src={stylist.image}
                  alt={stylist.name}
                  className="w-full h-56 sm:h-64 lg:h-72 object-cover object-top"
                />

                <div className="p-5 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                    {stylist.name}
                  </h2>

                  <p className="text-pink-500 font-semibold mt-2 text-sm sm:text-base">
                    {stylist.specialty}
                  </p>

                  <p className="text-gray-600 mt-3 text-sm sm:text-base">
                    {stylist.services?.length || 0} services available
                  </p>

                  <Link
                    to={`/stylists/${stylist._id}`}
                    className="mt-6 inline-block w-full text-center bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-full font-semibold transition"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Stylists;
