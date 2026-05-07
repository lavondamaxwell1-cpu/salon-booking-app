import api from "./api";

export function createAppointment(appointmentData) {
  return api.post("/appointments", appointmentData);
}

export function getMyAppointments() {
  return api.get("/appointments/my");
}

export function getAllAppointments() {
  return api.get("/appointments");
}
export function getBookedTimes(stylistId, date) {
  return api.get(
    `/appointments/booked-times?stylistId=${stylistId}&date=${date}`,
  );
}

export function updateAppointmentStatus(id, status) {
  return api.put(`/appointments/${id}/status`, { status });
}

export function cancelAppointment(id) {
  return api.put(`/appointments/${id}/cancel`);
}