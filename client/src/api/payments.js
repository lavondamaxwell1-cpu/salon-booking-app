import api from "./api";

export function createCheckoutSession(appointmentId) {
  return api.post(`/payments/create-checkout-session/${appointmentId}`);
}
