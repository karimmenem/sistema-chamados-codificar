import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getSupportPeople(
  _req: Request,
  res: Response,
) {
  try {
    const supportPeople = await prisma.supportPerson.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.json(supportPeople);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch support people." });
  }
}