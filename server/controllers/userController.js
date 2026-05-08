import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import Review from "../models/Review.js";
import Stylist from "../models/Stylist.js";
export async function getUsers(req, res) {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
}

export async function updateUserRole(req, res) {
  const { role } = req.body;

  if (!["customer", "stylist", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.role = role;

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
  });
}
export async function deleteUser(req, res) {
  if (req.user._id.toString() === req.params.id) {
    return res.status(400).json({
      message: "You cannot delete your own admin account",
    });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // If user is a stylist, find their stylist profile
  const stylistProfile = await Stylist.findOne({ user: user._id });

  if (stylistProfile) {
    // Delete appointments connected to that stylist
    await Appointment.deleteMany({
      stylistId: stylistProfile._id.toString(),
    });

    // Delete reviews connected to that stylist
    await Review.deleteMany({
      stylist: stylistProfile._id,
    });

    // Delete stylist profile
    await stylistProfile.deleteOne();
  }

  // Delete appointments made by this customer
  await Appointment.deleteMany({
    customer: user._id,
  });

  // Delete reviews written by this customer
  await Review.deleteMany({
    customer: user._id,
  });

  // Delete user account
  await user.deleteOne();

  res.json({
    message: "User and related data deleted successfully",
  });
}