import express from "express";
import {
  createStylist,
  getStylists,
  getStylistById,
  getMyStylistProfile,
  updateMyStylistProfile,
} from "../controllers/stylistController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getStylists);


router.post("/", protect, authorizeRoles("stylist", "admin"), createStylist);

router.get(
  "/me/profile",
  protect,
  authorizeRoles("stylist"),
  getMyStylistProfile,
);

router.put(
  "/me/profile",
  protect,
  authorizeRoles("stylist"),
  updateMyStylistProfile,
);

router.get("/:id", getStylistById);

export default router;
