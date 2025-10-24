"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// register routes
router.post('/register', (req, res) => {
    res.send('Handled');
});
exports.default = router;
