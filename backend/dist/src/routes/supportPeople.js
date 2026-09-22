"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supportPeople_js_1 = require("../controllers/supportPeople.js");
const router = (0, express_1.Router)();
router.get("/", supportPeople_js_1.getSupportPeople);
exports.default = router;
