"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTicket = createTicket;
exports.getTickets = getTickets;
exports.getTicket = getTicket;
exports.updateTicket = updateTicket;
exports.deleteTicket = deleteTicket;
const prisma_js_1 = require("../lib/prisma.js");
async function createTicket(req, res) {
    try {
        const { title, description, priority, assignedToId, automaticAssignment, } = req.body;
        if (!title || !description || !priority) {
            return res.status(400).json({
                error: "Title, description, and priority are required.",
            });
        }
        let supportPersonId = assignedToId;
        if (automaticAssignment) {
            const supportPeople = await prisma_js_1.prisma.supportPerson.findMany({
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
        const ticket = await prisma_js_1.prisma.ticket.create({
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Failed to create ticket.",
        });
    }
}
async function getTickets(_req, res) {
    try {
        const tickets = await prisma_js_1.prisma.ticket.findMany({
            include: {
                assignedTo: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.json(tickets);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Failed to fetch tickets.",
        });
    }
}
async function getTicket(req, res) {
    try {
        const ticketId = Number(req.params.id);
        if (Number.isNaN(ticketId)) {
            return res.status(400).json({
                error: "Invalid ticket ID.",
            });
        }
        const ticket = await prisma_js_1.prisma.ticket.findUnique({
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Failed to fetch ticket.",
        });
    }
}
async function updateTicket(req, res) {
    try {
        const ticketId = Number(req.params.id);
        if (Number.isNaN(ticketId)) {
            return res.status(400).json({
                error: "Invalid ticket ID.",
            });
        }
        const { title, description, priority, status, assignedToId, } = req.body;
        const existingTicket = await prisma_js_1.prisma.ticket.findUnique({
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
            const supportPerson = await prisma_js_1.prisma.supportPerson.findUnique({
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
        const ticket = await prisma_js_1.prisma.ticket.update({
            where: {
                id: ticketId,
            },
            data: {
                title,
                description,
                priority,
                status,
                assignedToId: assignedToId !== undefined ? Number(assignedToId) : undefined,
            },
            include: {
                assignedTo: true,
            },
        });
        return res.json(ticket);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Failed to update ticket.",
        });
    }
}
async function deleteTicket(req, res) {
    try {
        const ticketId = Number(req.params.id);
        if (Number.isNaN(ticketId)) {
            return res.status(400).json({
                error: "Invalid ticket ID.",
            });
        }
        const existingTicket = await prisma_js_1.prisma.ticket.findUnique({
            where: {
                id: ticketId,
            },
        });
        if (!existingTicket) {
            return res.status(404).json({
                error: "Ticket not found.",
            });
        }
        await prisma_js_1.prisma.ticket.delete({
            where: {
                id: ticketId,
            },
        });
        return res.status(204).send();
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Failed to delete ticket.",
        });
    }
}
