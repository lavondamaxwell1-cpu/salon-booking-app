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
    return res.status(404).json({ message: "Stylist not found" });
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

  const customer = await User.findById(req.user._id);
  const stylistUser = await User.findById(stylistProfile.user);

  try {
    if (customer?.email) {
      await sendEmail({
        to: customer.email,
        subject: "Your GlowUp Salon Appointment is Booked",
        text: `Hi ${customer.name},

Your appointment has been booked!

Service: ${service}
Stylist: ${stylist}
Date: ${date}
Time: ${time}

Thank you for booking with GlowUp Salon!`,
      });
    }
  } catch (error) {
    console.log("Customer email failed:", error.message);
  }
  try {
    if (customer?.phone) {
      const sms = await sendSMS({
        to: customer.phone,
        message: `GlowUp Salon: Your appointment is booked for ${date} at ${time} with ${stylist}.`,
      });

      console.log("SMS SENT:", sms);
    }
  } catch (error) {
    console.log("Customer SMS failed:", error.message);
  }
  try {
    if (stylistUser?.email) {
      await sendEmail({
        to: stylistUser.email,
        subject: "New Appointment Booked",
        text: `Hi ${stylistUser.name},

You have a new appointment!

Customer: ${customer?.name}
Service: ${service}
Date: ${date}
Time: ${time}
Notes: ${notes || "No notes"}

Please check your stylist dashboard for details.

GlowUp Salon`,
      });
    }
  } catch (error) {
    console.log("Stylist email failed:", error.message);
  }

  io.emit("appointmentCreated", appointment);

  res.status(201).json(appointment);
}

export async function getMyAppointments(req, res) {
  const appointments = await Appointment.find({
    customer: req.user._id,
  }).sort({ createdAt: -1 });

  res.json(appointments);
}

export async function getAllAppointments(req, res) {
  const appointments = await Appointment.find()
    .populate("customer", "name email")
    .sort({ createdAt: -1 });

  res.json(appointments);
}

export async function getStylistAppointments(req, res) {
  const stylistProfile = await Stylist.findOne({ user: req.user._id });

  if (!stylistProfile) {
    return res.status(404).json({ message: "Stylist profile not found" });
  }

  const appointments = await Appointment.find({
    stylistId: stylistProfile._id.toString(),
  })
    .populate("customer", "name email")
    .sort({ date: 1 });

  res.json(appointments);
}

export async function getBookedTimes(req, res) {
  const { stylistId, date } = req.query;

  if (!stylistId || !date) {
    return res.status(400).json({
      message: "Stylist ID and date are required",
    });
  }

  const appointments = await Appointment.find({
    stylistId,
    date,
    status: { $ne: "Canceled" },
  });

  const bookedTimes = appointments.map((appointment) => appointment.time);

  res.json(bookedTimes);
}

export async function updateAppointmentStatus(req, res) {
  const { status } = req.body;

  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  appointment.status = status;

  const updatedAppointment = await appointment.save();

  io.emit("appointmentUpdated", updatedAppointment);

  res.json(updatedAppointment);
}

export async function updateAppointmentDateTime(req, res) {
  const { date, time, durationMinutes } = req.body;

  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  appointment.date = date;
  appointment.time = time;

  if (durationMinutes) {
    appointment.durationMinutes = durationMinutes;
  }

  const updatedAppointment = await appointment.save();

  io.emit("appointmentUpdated", updatedAppointment);

  res.json(updatedAppointment);
}

export async function cancelAppointment(req, res) {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found" });
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

  const customer = await User.findById(updatedAppointment.customer);

  try {
    if (customer?.phone) {
      const sms = await sendSMS({
        to: customer.phone,
        message: `GlowUp Salon: Your appointment on ${updatedAppointment.date} at ${updatedAppointment.time} has been canceled.`,
      });

      console.log("CANCELLATION SMS SENT:", sms.sid);
    }
  } catch (error) {
    console.log("Cancellation SMS failed:", error.message);
  }

  io.emit("appointmentCanceled", updatedAppointment);

  res.json(updatedAppointment);
}
