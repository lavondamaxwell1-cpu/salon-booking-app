import express from "express";
import {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getBookedTimes,
  updateAppointmentDateTime,
  getStylistAppointments,
} from "../controllers/appointmentController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createAppointment);

router.get("/booked-times", getBookedTimes);
router.get("/my", protect, getMyAppointments);

router.get(
  "/",
  protect,
  authorizeRoles("stylist", "admin"),
  getAllAppointments,
);
router.get(
  "/stylist/me",
  protect,
  authorizeRoles("stylist"),
  getStylistAppointments,
);
router.put(
  "/:id/datetime",
  protect,
  authorizeRoles("stylist", "admin"),
  updateAppointmentDateTime,
);
router.put(
  "/:id/status",
  protect,
  authorizeRoles("stylist", "admin"),
  updateAppointmentStatus,
);
router.put("/:id/cancel", protect, cancelAppointment);
export default router;
