export type Priority = "LOW" | "MEDIUM" | "HIGH";

export type TicketStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED";

export interface SupportPerson {
  id: number;
  name: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: TicketStatus;
  assignedToId: number;
  createdAt: string;
  updatedAt: string;
  assignedTo: SupportPerson;
}