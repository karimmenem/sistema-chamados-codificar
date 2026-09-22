import type { Ticket } from "../types/ticket";

const API_URL = "http://localhost:3000";

export async function getTickets(): Promise<Ticket[]> {
  const response = await fetch(`${API_URL}/tickets`);

  if (!response.ok) {
    throw new Error("Failed to fetch tickets.");
  }

  return response.json();
}