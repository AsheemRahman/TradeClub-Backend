"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = __importDefault(require("../../Controller/Admin/implementation/adminController"));
const adminService_1 = __importDefault(require("../../Service/Admin/Implementation/adminService"));
const AdminRepository_1 = __importDefault(require("../../repository/admin/implementation/AdminRepository"));
const adminRepository = new AdminRepository_1.default();
const adminService = new adminService_1.default(adminRepository);
const adminController = new adminController_1.default(adminService);
const router = (0, express_1.Router)();
const adminController = new adminController_1.default(adminService);
exports.default = router;
