"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const prisma_js_1 = require("./lib/prisma.js");
const tickets_js_1 = __importDefault(require("./routes/tickets.js"));
const supportPeople_js_1 = __importDefault(require("./routes/supportPeople.js"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/health", async (_req, res) => {
    try {
        await prisma_js_1.prisma.supportPerson.count();
        res.json({ status: "ok", database: "connected" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", database: "disconnected" });
    }
});
app.use("/tickets", tickets_js_1.default);
app.use("/support-people", supportPeople_js_1.default);
app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
