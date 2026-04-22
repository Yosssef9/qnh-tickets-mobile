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
export async function getTicketById(ticketId) {
  const response = await api.get(`/api/tickets/${ticketId}`);
  return response.data;
}

export function getTicketAttachmentDownloadUrl(ticketId, attachmentId) {
  const base = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("auth_token");

  return `${base}/api/tickets/${ticketId}/attachments/${attachmentId}/download?token=${encodeURIComponent(token || "")}`;
}
/**
 * Step 1: Create ticket
 */
export async function createMobileTicket({ title, description, imageFile }) {
  const formData = new FormData();

  const finalDescription =
    description && description.trim() ? description : title;

  formData.append("title", title);
  formData.append("description", finalDescription);
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

  return response.data;
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
 */ export async function createAndAssignTicket({
  title,
  description,
  technicianCode,
  imageFile,
}) {
  // Step 1: Create
  const createRes = await createMobileTicket({
    title,
    description,
    imageFile,
  });

  if (!createRes?.success) {
    throw new Error(createRes?.message || "Create ticket failed");
  }

  const ticketId = createRes.ticketId;

  // ✅ Step 2: Assign ONLY if technician exists
  if (technicianCode) {
    const assignRes = await assignTechnician(ticketId, technicianCode);

    if (!assignRes?.success) {
      throw new Error(assignRes?.message || "Assign technician failed");
    }
  }

  return {
    success: true,
    ticketId,
    ticketNumber: createRes.ticketNumber,
  };
}
