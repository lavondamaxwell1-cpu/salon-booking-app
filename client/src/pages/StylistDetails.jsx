import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getStylistById } from "../api/stylists";
import { createReview, getStylistReviews } from "../api/reviews";
import { useAuth } from "../context/useAuth";
function StylistDetails() {
  const { id } = useParams();
const { user } = useAuth();

const [reviews, setReviews] = useState([]);
const [averageRating, setAverageRating] = useState(0);
const [totalReviews, setTotalReviews] = useState(0);
const [rating, setRating] = useState(5);
const [comment, setComment] = useState("");
const [reviewError, setReviewError] = useState("");
  const [stylist, setStylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStylist() {
      try {
        const res = await getStylistById(id);
        setStylist(res.data);const reviewRes = await getStylistReviews(id);
        setReviews(reviewRes.data.reviews);
        setAverageRating(reviewRes.data.averageRating);
        setTotalReviews(reviewRes.data.totalReviews);

        console.log("STYLIST DATA:", res.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load stylist");
      } finally {
        setLoading(false);
      }
    }

    fetchStylist();
  }, [id]);
async function handleReviewSubmit(e) {
  e.preventDefault();
  setReviewError("");

  try {
    await createReview({
      stylist: stylist._id,
      rating,
      comment,
    });

    const reviewRes = await getStylistReviews(id);
    setReviews(reviewRes.data.reviews);
    setAverageRating(reviewRes.data.averageRating);
    setTotalReviews(reviewRes.data.totalReviews);
    setComment("");
    setRating(5);
  } catch (error) {
    setReviewError(error.response?.data?.message || "Failed to submit review");
  }
}

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <p className="text-pink-500 font-semibold text-xl">
          Loading stylist...
        </p>
      </div>
    );
  }

  if (error || !stylist) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-lg p-10 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Stylist not found
          </h1>

          <p className="text-gray-500 mb-6">
            {error || "We couldn’t find that stylist."}
          </p>

          <Link
            to="/stylists"
            className="inline-block bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-semibold transition"
          >
            Back to Stylists
          </Link>
        </div>
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
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/600x800?text=Stylist+Image";
            }}
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
            <p className="text-yellow-500 font-bold mb-8">
              ⭐ {averageRating.toFixed(1)} / 5 ({totalReviews} reviews)
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mb-5">Services</h2>

            <div className="space-y-4">
              {stylist.services?.map((service) => (
                <div
                  key={service._id || service.name}
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

            {stylist.gallery?.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-5">
                  Hairstyle Gallery
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  {stylist.gallery.map((item) => {
                    console.log("GALLERY ITEM:", item);

                    return (
                      <div
                        key={item._id || item.image}
                        className="rounded-2xl overflow-hidden border border-pink-100 bg-white"
                      >
                        <img
                          src={item.image?.trim()}
                          alt={item.title}
                          onError={(e) => {
                            console.log("BAD IMAGE URL:", item.image);
                            e.currentTarget.src =
                              "https://placehold.co/600x400?text=Image+Not+Found";
                          }}
                          className="w-full h-48 object-cover"
                        />

                        <div className="p-3 bg-pink-50">
                          <p className="font-semibold text-gray-800">
                            {item.title}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">Reviews</h2>

              {user?.role === "customer" && (
                <form onSubmit={handleReviewSubmit} className="space-y-4 mb-6">
                  {reviewError && (
                    <p className="bg-red-100 text-red-700 px-4 py-3 rounded-xl">
                      {reviewError}
                    </p>
                  )}

                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full border border-pink-100 rounded-xl px-4 py-3"
                  >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                  </select>

                  <textarea
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Leave a review..."
                    className="w-full border border-pink-100 rounded-xl px-4 py-3"
                    required
                  />

                  <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-semibold transition">
                    Submit Review
                  </button>
                </form>
              )}

              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-gray-500">No reviews yet.</p>
                ) : (
                  reviews.map((review) => (
                    <div
                      key={review._id}
                      className="border border-pink-100 rounded-2xl p-4"
                    >
                      <p className="text-yellow-500 font-bold">
                        {"⭐".repeat(review.rating)}
                      </p>

                      <p className="text-gray-700 mt-2">{review.comment}</p>

                      <p className="text-gray-400 text-sm mt-2">
                        By {review.customer?.name || "Customer"}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
            <Link
              to={`/book/${stylist._id}`}
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
