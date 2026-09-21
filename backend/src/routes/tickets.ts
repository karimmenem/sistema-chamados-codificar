import { Router } from "express";
import {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
} from "../controllers/tickets.js";


const router = Router();

router.post("/", createTicket);
router.get("/", getTickets);
router.get("/:id", getTicket);
router.put("/:id", updateTicket);

export default router;