import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import Stylist from "../models/Stylist.js";

export async function getAdminStats(req, res) {
  const today = new Date().toISOString().split("T")[0];

  const totalAppointments = await Appointment.countDocuments();
  const todaysAppointments = await Appointment.countDocuments({ date: today });
  const paidAppointments = await Appointment.countDocuments({
    paymentStatus: "Paid",
  });
  const unpaidAppointments = await Appointment.countDocuments({
    paymentStatus: "Unpaid",
  });
  const completedAppointments = await Appointment.countDocuments({
    status: "Completed",
  });
  const canceledAppointments = await Appointment.countDocuments({
    status: "Canceled",
  });

  const totalUsers = await User.countDocuments();
  const totalStylists = await Stylist.countDocuments();

  const estimatedRevenue = paidAppointments * 25;

  res.json({
    totalAppointments,
    todaysAppointments,
    paidAppointments,
    unpaidAppointments,
    completedAppointments,
    canceledAppointments,
    totalUsers,
    totalStylists,
    estimatedRevenue,
  });
}
