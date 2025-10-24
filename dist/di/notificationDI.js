"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationController = void 0;
const notificationRepository_1 = __importDefault(require("../repository/user/implementation/notificationRepository"));
const notificationService_1 = __importDefault(require("../service/user/implementation/notificationService"));
const userRepository_1 = __importDefault(require("../repository/user/implementation/userRepository"));
const notificationController_1 = __importDefault(require("../controller/user/implementation/notificationController"));
const UserRepository = new userRepository_1.default();
const notificationRepository = new notificationRepository_1.default();
const notificationService = new notificationService_1.default(notificationRepository, UserRepository);
const notificationController = new notificationController_1.default(notificationService);
exports.notificationController = notificationController;
