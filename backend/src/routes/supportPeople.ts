import { Router } from "express";
import { getSupportPeople } from "../controllers/supportPeople.js";

const router = Router();

router.get("/", getSupportPeople);

export default router;