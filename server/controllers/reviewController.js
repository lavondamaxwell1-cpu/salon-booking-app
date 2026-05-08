import Review from "../models/Review.js";

export async function createReview(req, res) {
  const { stylist, rating, comment } = req.body;

  const existingReview = await Review.findOne({
    customer: req.user._id,
    stylist,
  });

  if (existingReview) {
    return res.status(400).json({
      message: "You already reviewed this stylist",
    });
  }

  const review = await Review.create({
    customer: req.user._id,
    stylist,
    rating,
    comment,
  });

  res.status(201).json(review);
}

export async function getStylistReviews(req, res) {
  const reviews = await Review.find({ stylist: req.params.stylistId })
    .populate("customer", "name")
    .sort({ createdAt: -1 });

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  res.json({
    averageRating,
    totalReviews: reviews.length,
    reviews,
  });
}
