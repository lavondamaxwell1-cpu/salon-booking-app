// jobs/appointmentReminderJob.js

import cron from "node-cron";
import Appointment from "../models/Appointment.js";
import { sendSMS } from "../utils/sendSMS.js";

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    const appointments = await Appointment.find({
      status: "Booked",
      reminderSent: false,
    }).populate("customer");

    for (const appointment of appointments) {
      const appointmentDateTime = new Date(
        `${appointment.date} ${appointment.time}`,
      );

      const diffMs = appointmentDateTime.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours <= 24 && diffHours > 23.98) {
        if (appointment.customer?.phone) {
          const sms = await sendSMS({
            to: appointment.customer.phone,
            message: `GlowUp Salon Reminder: You have an appointment tomorrow on ${appointment.date} at ${appointment.time}.`,
          });

          console.log("REMINDER SMS SENT:", sms.sid);

          appointment.reminderSent = true;
          await appointment.save();
        }
      }
    }
  } catch (error) {
    console.log("Appointment reminder cron failed:", error.message);
  }
});
