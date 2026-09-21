import { Router } from "express";
import {
  createTicket,
  getTickets,
  getTicket,
} from "../controllers/tickets.js";


const router = Router();

router.post("/", createTicket);
router.get("/", getTickets);
router.get("/:id", getTicket);

export default router;