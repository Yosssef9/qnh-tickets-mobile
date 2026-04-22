import api from "./api";
export async function getMyTickets() {
  return await api.get("/api/tickets/my-tickets?source=ticket");
}

export async function getAllTickets() {
  return await api.get("/api/tickets/all");
}

export async function createTicket(formData) {
  const response = await api.post("/api/tickets/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
