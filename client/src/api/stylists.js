import api from "./api";

export function getStylists() {
  return api.get("/stylists");
}
export function getMyStylistProfile() {
  return api.get("/stylists/me/profile");
}

export function updateMyStylistProfile(stylistData) {
  return api.put("/stylists/me/profile", stylistData);
}

export function createStylist(stylistData) {
  return api.post("/stylists", stylistData);
}

export function getStylistById(id) {
  return api.get(`/stylists/${id}`);
}