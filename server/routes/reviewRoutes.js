import express from "express";
import {
  createReview,
  getStylistReviews,
} from "../controllers/reviewController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("customer"), createReview);

router.get("/stylist/:stylistId", getStylistReviews);

export default router;
