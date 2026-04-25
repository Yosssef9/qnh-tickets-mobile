import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllTickets,
  getMyTickets,
  getTicketById,
  getAvailableTechnicians,
  createMobileTicket,
  assignTechnician,
} from "../../services/ticketsApi";

export function useMyTickets() {
  return useQuery({
    queryKey: ["tickets", "my"],
    queryFn: async () => {
      const response = await getMyTickets();
      return response.data?.tickets || [];
    },
  });
}

export function useAllTickets() {
  return useQuery({
    queryKey: ["tickets", "all"],
    queryFn: async () => {
      const response = await getAllTickets();
      return response.data?.tickets || [];
    },
  });
}

export function useTicketDetails(ticketId) {
  return useQuery({
    queryKey: ["tickets", "details", ticketId],
    queryFn: () => getTicketById(ticketId),
    enabled: Boolean(ticketId),
  });
}

export function useAvailableTechnicians(category = "IT Support") {
  return useQuery({
    queryKey: ["technicians", category],
    queryFn: async () => {
      const response = await getAvailableTechnicians(category);
      return response.data?.technicians || response.data || [];
    },
    enabled: Boolean(category),
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMobileTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}

export function useAssignTechnician() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, technicianCode }) =>
      assignTechnician(ticketId, technicianCode),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });

      if (variables?.ticketId) {
        queryClient.invalidateQueries({
          queryKey: ["tickets", "details", variables.ticketId],
        });
      }
    },
  });
}
