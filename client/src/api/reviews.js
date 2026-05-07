import api from "./api";

export function createReview(reviewData) {
  return api.post("/reviews", reviewData);
}

export function getStylistReviews(stylistId) {
  return api.get(`/reviews/stylist/${stylistId}`);
}
