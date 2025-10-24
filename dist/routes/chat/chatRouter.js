"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = __importDefault(require("../../middleware/authentication"));
const chatDI_1 = require("../../di/chatDI");
const router = (0, express_1.default)();
router.get('/getChats', (0, authentication_1.default)(), chatDI_1.chatController.getChats.bind(chatDI_1.chatController));
router.post('/create-chat/:id', (0, authentication_1.default)(), chatDI_1.chatController.createChat.bind(chatDI_1.chatController));
router.post('/send/:id', (0, authentication_1.default)(), chatDI_1.messageController.sendMessage.bind(chatDI_1.messageController));
router.get('/get-messages/:id', (0, authentication_1.default)(), chatDI_1.messageController.getMessages.bind(chatDI_1.messageController));
router.delete('/delete-message/:id', (0, authentication_1.default)(), chatDI_1.messageController.deleteMessages.bind(chatDI_1.messageController));
router.post('/mark-read/:id', (0, authentication_1.default)(), chatDI_1.messageController.markMessagesAsRead.bind(chatDI_1.messageController));
exports.default = router;
