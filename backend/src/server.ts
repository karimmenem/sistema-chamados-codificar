import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";
import ticketRoutes from "./routes/tickets.js";
import supportPeopleRoutes from "./routes/supportPeople.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    await prisma.supportPerson.count();

    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", database: "disconnected" });
  }
});

app.use("/tickets", ticketRoutes);
app.use("/support-people", supportPeopleRoutes);

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});