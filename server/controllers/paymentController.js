import Stripe from "stripe";
import Appointment from "../models/Appointment.js";
import { sendEmail } from "../utils/sendEmail.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createCheckoutSession(req, res) {
  const appointment = await Appointment.findById(req.params.appointmentId);

  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  if (appointment.customer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not allowed" });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${appointment.service} with ${appointment.stylist}`,
          },
          unit_amount: 2500,
        },
        quantity: 1,
      },
    ],
    success_url: "https://salon-booking-app-pi-lake.vercel.app/payment-success",
    cancel_url: "https://salon-booking-app-pi-lake.vercel.app/my-appointments",
    metadata: {
      appointmentId: appointment._id.toString(),
    },
  });

  appointment.stripeSessionId = session.id;
  await appointment.save();

  res.json({ url: session.url });
}

export async function stripeWebhook(req, res) {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.log("Webhook signature failed:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const appointmentId = session.metadata.appointmentId;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        paymentStatus: "Paid",
        stripeSessionId: session.id,
      },
      { new: true },
    ).populate("customer", "name email");

    if (appointment?.customer?.email) {
      await sendEmail({
        to: appointment.customer.email,
        subject: "Payment Received - GlowUp Salon",
        text: `Hi ${appointment.customer.name},

Your payment was received successfully!

Service: ${appointment.service}
Stylist: ${appointment.stylist}
Date: ${appointment.date}
Time: ${appointment.time}
Payment Status: Paid

Thank you for choosing GlowUp Salon!`,
      });
    }

    console.log("Appointment marked paid:", appointmentId);
  }

  res.json({ received: true });
}
