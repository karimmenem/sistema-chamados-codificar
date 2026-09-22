"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupportPeople = getSupportPeople;
const prisma_js_1 = require("../lib/prisma.js");
async function getSupportPeople(_req, res) {
    try {
        const supportPeople = await prisma_js_1.prisma.supportPerson.findMany({
            orderBy: {
                name: "asc",
            },
        });
        res.json(supportPeople);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch support people." });
    }
}
