import Appointment from "../models/Appointment.js";
import Stylist from "../models/Stylist.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import { io } from "../server.js";
import { sendSMS } from "../utils/sendSMS.js";
export async function createAppointment(req, res) {
  const { stylistId, stylist, service, date, time, notes } = req.body;

  const stylistProfile = await Stylist.findById(stylistId);

  if (!stylistProfile) {
    return res.status(404).json({
      message: "Stylist not found",
    });
  }

  if (stylistProfile.blockedDates?.includes(date)) {
    return res.status(400).json({
      message: "This stylist is unavailable on this date.",
    });
  }

  const existingAppointment = await Appointment.findOne({
    stylistId,
    date,
    time,
    status: { $ne: "Canceled" },
  });

  if (existingAppointment) {
    return res.status(400).json({
      message: "This time slot is already booked. Please choose another time.",
    });
  }

  const appointment = await Appointment.create({
    customer: req.user._id,
    stylistId,
    stylist,
    service,
    date,
    time,
    notes,
    status: "Pending",
    paymentStatus: "Unpaid",
  });

  io.emit("appointmentCreated", appointment);

  res.status(201).json(appointment);
}
export async function cancelAppointment(req, res) {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return res.status(404).json({
      message: "Appointment not found",
    });
  }

  if (
    appointment.customer.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      message: "Not allowed to cancel this appointment",
    });
  }

  appointment.status = "Canceled";

  const updatedAppointment = await appointment.save();

  io.emit("appointmentCanceled", updatedAppointment);

  res.json(updatedAppointment);
}