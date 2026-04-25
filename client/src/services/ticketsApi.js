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

export function getTicketAttachmentDownloadUrl(filePath) {
  const base = import.meta.env.VITE_API_BASE_URL;

  if (!filePath) return "";

  // normalize slashes
  const normalized = filePath.replace(/\\/g, "/");

  // find where "uploads" starts
  const index = normalized.toLowerCase().indexOf("uploads/");

  if (index === -1) {
    console.warn("Invalid file path:", filePath);
    return "";
  }

  // keep only /uploads/...
  const publicPath = normalized.substring(index);

  return `${base}/${publicPath}`;
}
/**
 * Step 1: Create ticket
 */ export async function createMobileTicket({
  title,
  description,
  imageFile,
  priority,
  technicianCode,
}) {
  const formData = new FormData();

  const finalDescription =
    description && description.trim() ? description : title;

  formData.append("title", title);
  formData.append("description", finalDescription);
  formData.append("category", "IT Support");
  formData.append("source", "ticket");
  formData.append("ticket_type_id", 7);
  formData.append("priority", priority || "Medium");

  if (technicianCode) {
    formData.append("assigned_to", technicianCode);
  }

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

