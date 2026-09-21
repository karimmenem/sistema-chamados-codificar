import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function createTicket(req: Request, res: Response) {
  try {
    const {
      title,
      description,
      priority,
      assignedToId,
      automaticAssignment,
    } = req.body;

    if (!title || !description || !priority) {
      return res.status(400).json({
        error: "Title, description, and priority are required.",
      });
    }

    let supportPersonId = assignedToId;

    if (automaticAssignment) {
      const supportPeople = await prisma.supportPerson.findMany({
        include: {
          tickets: {
            where: {
              status: {
                in: ["OPEN", "IN_PROGRESS"],
              },
            },
          },
        },
      });

      const personWithFewestTickets = supportPeople.reduce((current, person) => {
        if (!current || person.tickets.length < current.tickets.length) {
          return person;
        }

        return current;
      }, supportPeople[0]);

      if (!personWithFewestTickets) {
        return res.status(400).json({
          error: "No support people are available.",
        });
      }

      supportPersonId = personWithFewestTickets.id;
    }

    if (!supportPersonId) {
      return res.status(400).json({
        error: "A support person must be assigned.",
      });
    }

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority,
        assignedToId: Number(supportPersonId),
      },
      include: {
        assignedTo: true,
      },
    });

    return res.status(201).json(ticket);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to create ticket.",
    });
  }
}

export async function getTickets(_req: Request, res: Response) {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        assignedTo: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(tickets);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to fetch tickets.",
    });
  }
}

export async function getTicket(req: Request, res: Response) {
  try {
    const ticketId = Number(req.params.id);

    if (Number.isNaN(ticketId)) {
      return res.status(400).json({
        error: "Invalid ticket ID.",
      });
    }

    const ticket = await prisma.ticket.findUnique({
      where: {
        id: ticketId,
      },
      include: {
        assignedTo: true,
      },
    });

    if (!ticket) {
      return res.status(404).json({
        error: "Ticket not found.",
      });
    }

    return res.json(ticket);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to fetch ticket.",
    });
  }
}

export async function updateTicket(req: Request, res: Response) {
  try {
    const ticketId = Number(req.params.id);

    if (Number.isNaN(ticketId)) {
      return res.status(400).json({
        error: "Invalid ticket ID.",
      });
    }

    const {
      title,
      description,
      priority,
      status,
      assignedToId,
    } = req.body;

    const existingTicket = await prisma.ticket.findUnique({
      where: {
        id: ticketId,
      },
    });

    if (!existingTicket) {
      return res.status(404).json({
        error: "Ticket not found.",
      });
    }

    if (assignedToId !== undefined) {
      const supportPerson = await prisma.supportPerson.findUnique({
        where: {
          id: Number(assignedToId),
        },
      });

      if (!supportPerson) {
        return res.status(400).json({
          error: "Support person not found.",
        });
      }
    }

    const ticket = await prisma.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        title,
        description,
        priority,
        status,
        assignedToId:
          assignedToId !== undefined ? Number(assignedToId) : undefined,
      },
      include: {
        assignedTo: true,
      },
    });

    return res.json(ticket);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to update ticket.",
    });
  }
}