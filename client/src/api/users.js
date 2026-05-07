import api from "./api";

export function getUsers() {
  return api.get("/users");
}

export function updateUserRole(id, role) {
  return api.put(`/users/${id}/role`, { role });
}
export function deleteUser(id) {
  return api.delete(`/users/${id}`);
}