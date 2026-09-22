import type { Priority, SupportPerson, Ticket } from "../types/ticket";

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

export async function getSupportPeople(): Promise<SupportPerson[]> {
  const response = await fetch(`${API_URL}/support-people`);

  if (!response.ok) {
    throw new Error("Failed to fetch support people.");
  }

  return response.json();
}

export async function updateTicket(
  id: number,
  data: {
    title: string;
    description: string;
    priority: Priority;
    status: Ticket["status"];
    assignedToId: number;
  },
): Promise<Ticket> {
  const response = await fetch(`${API_URL}/tickets/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update ticket.");
  }

  return response.json();
}

export async function deleteTicket(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/tickets/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete ticket.");
  }
}