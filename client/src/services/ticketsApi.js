import api from "./api";

export async function getMyTickets() {
  return await api.get("/api/tickets/my-tickets?source=ticket");
}

export async function getAllTickets() {
  return await api.get("/api/tickets/all");
}

export async function getAvailableTechnicians(category = "IT Support") {
  return await api.get(
    `/api/tickets/technicians/available?category=${encodeURIComponent(category)}`,
  );
}

/**
 * Step 1: Create ticket
 */
export async function createMobileTicket({ description, imageFile }) {
  const formData = new FormData();

  formData.append("title", "Ticket from mobile");
  formData.append("description", description);
  formData.append("category", "IT Support");
  formData.append("source", "ticket");
  formData.append("ticket_type_id", 7);
  if (imageFile) {
    formData.append("attachments", imageFile);
  }

  const response = await api.post("/api/tickets/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data; // { success, ticketId, ticketNumber }
}

/**
 * Step 2: Assign technician
 */
export async function assignTechnician(ticketId, technicianCode) {
  const response = await api.put(`/api/tickets/${ticketId}`, {
    assigned_to: technicianCode,
  });

  return response.data;
}

/**
 * Final helper: Create + Assign
 */
export async function createAndAssignTicket({
  description,
  technicianCode,
  imageFile,
}) {
  // Step 1: Create
  const createRes = await createMobileTicket({
    description,
    imageFile,
  });

  if (!createRes?.success) {
    throw new Error(createRes?.message || "Create ticket failed");
  }

  const ticketId = createRes.ticketId;

  // Step 2: Assign
  const assignRes = await assignTechnician(ticketId, technicianCode);

  if (!assignRes?.success) {
    throw new Error(assignRes?.message || "Assign technician failed");
  }

  return {
    success: true,
    ticketId,
    ticketNumber: createRes.ticketNumber,
  };
}
