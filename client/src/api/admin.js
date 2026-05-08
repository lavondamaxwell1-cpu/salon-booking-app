import api from "./api";

export function getAdminStats() {
  return api.get("/admin/stats");
}
