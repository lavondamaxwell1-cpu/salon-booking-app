import Appointment from "../models/Appointment.js";
import Stylist from "../models/Stylist.js";
import { io } from "../server.js";

export async function createAppointment(req, res) {
  try {
    console.log("CREATE APPOINTMENT HIT");
    console.log("USER:", req.user);
    console.log("BODY:", req.body);

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
        message:
          "This time slot is already booked. Please choose another time.",
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

    return res.status(201).json(appointment);
  } catch (error) {
    console.log("CREATE APPOINTMENT ERROR:", error.message);
    return res.status(500).json({ message: error.message });
  }
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

  io.emit("appointmentCanceled", updatedAppointment);

  res.json(updatedAppointment);
}
