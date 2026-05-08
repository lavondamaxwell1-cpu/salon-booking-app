import express from "express";
import { getAdminStats } from "../controllers/adminController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, authorizeRoles("admin"), getAdminStats);

export default router;
