import express from "express";
import {
  getUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/userController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin"), getUsers);

router.put("/:id/role", protect, authorizeRoles("admin"), updateUserRole);

router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);

export default router;
