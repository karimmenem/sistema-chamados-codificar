import type { Priority, Ticket } from "../types/ticket";

const API_URL = "http://localhost:3000";

export async function getTickets(): Promise<Ticket[]> {
  const response = await fetch(`${API_URL}/tickets`);

  if (!response.ok) {
    throw new Error("Failed to fetch tickets.");
  }

  

  return response.json();
}

export async function getTicket(id: number): Promise<Ticket> {
  const response = await fetch(`${API_URL}/tickets/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch ticket.");
  }

  return response.json();
}

export async function createTicket(data: {
  title: string;
  description: string;
  priority: Priority;
  assignedToId?: number;
  automaticAssignment?: boolean;
}): Promise<Ticket> {
  const response = await fetch(`${API_URL}/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create ticket.");
  }

  return response.json();
}